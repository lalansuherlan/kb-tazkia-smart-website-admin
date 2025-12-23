import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Ambil Data Siswa + Integrasi Absensi + Data Anekdot (Logic Baru)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tanggal = searchParams.get("tanggal");
  const kelas = searchParams.get("kelas");
  const academicYear = searchParams.get("academic_year");
  const teacherId = searchParams.get("teacher_id");

  if (!tanggal || !academicYear) {
    return NextResponse.json(
      { error: "Parameter tanggal/tahun kurang" },
      { status: 400 }
    );
  }

  try {
    // 1. TENTUKAN FILTER (Guru vs Admin)
    let filterCondition = "";
    let filterParam = "";

    if (teacherId) {
      filterCondition = "AND s.teacher_id = ?";
      filterParam = teacherId;
    } else if (kelas) {
      filterCondition = "AND s.program_name = ?";
      filterParam = kelas;
    } else {
      return NextResponse.json({ success: true, data: [] });
    }

    // 2. QUERY UTAMA: Ambil Siswa & Absensi SAJA (Jangan ambil 'pad' dulu)
    // Kita hapus pad.id, pad.tempat, dll agar tidak error
    const sql = `
      SELECT 
        s.id as siswa_id,
        s.nis,                -- <--- TAMBAHKAN BARIS INI (PENTING!)
        s.full_name as nama,
        s.program_name as kelas_siswa,
        abs.status as status_absensi
      FROM students s
      LEFT JOIN absensi abs 
        ON s.id = abs.siswa_id AND abs.tanggal = ? AND abs.academic_year = ?
      WHERE s.status = 'active'
        AND s.academic_year = ?
        ${filterCondition}
      ORDER BY s.full_name ASC
    `;

    const params = [tanggal, academicYear, academicYear, filterParam];
    // Cast ke any[] agar TS tidak rewel
    const rows = (await query(sql, params)) as any[];

    // Jika tidak ada siswa, return kosong
    if (rows.length === 0) {
      return NextResponse.json({ success: true, header: null, data: [] });
    }

    // 3. DETEKSI KELAS & AMBIL HEADER ANEKDOT
    // Kita ambil nama kelas dari siswa pertama yang ditemukan
    const detectedClass = rows[0].kelas_siswa;

    // Cari Header berdasarkan Tanggal & Kelas yang terdeteksi
    const headerSql = `SELECT * FROM penilaian_anekdot WHERE tanggal = ? AND kelas = ? LIMIT 1`;
    const existingHeader = (await query(headerSql, [
      tanggal,
      detectedClass,
    ])) as any[];

    let headerData = null;
    let headerId = 0;

    if (Array.isArray(existingHeader) && existingHeader.length > 0) {
      headerData = existingHeader[0];
      headerId = (existingHeader[0] as any).id;
    }

    // 4. AMBIL DETAIL ANEKDOT (Jika Header Ditemukan)
    let details: any[] = [];
    if (headerId > 0) {
      const detailSql = `SELECT * FROM penilaian_anekdot_detail WHERE penilaian_id = ?`;
      details = (await query(detailSql, [headerId])) as any[];
    }

    // 5. GABUNGKAN DATA (MERGE) VIA JAVASCRIPT
    // Kita loop data siswa, lalu cari apakah dia punya nilai di 'details'
    const finalData = rows.map((row: any) => {
      // Cari detail nilai untuk siswa ini
      const detail = details.find((d: any) => d.siswa_id === row.siswa_id);

      return {
        ...row,
        // Jika ada detail di DB, pakai itu. Jika tidak, null/kosong.
        detail_id: detail ? detail.id : null,
        tempat: detail ? detail.tempat : null,
        peristiwa: detail ? detail.peristiwa : null,
        kriteria: detail ? detail.kriteria : null,
      };
    });

    return NextResponse.json({
      success: true,
      header: headerData,
      data: finalData, // Kirim data yang sudah digabung
      detected_class: detectedClass,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST: Simpan Data (Versi Anti-Error Undefined)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tanggal,
      kelas,
      usia,
      minggu_ke,
      jumlah_kegiatan,
      kegiatan,
      details,
    } = body;

    // --- HELPER: Ubah undefined jadi null ---
    const fixVal = (val: any) => (val === undefined ? null : val);

    // 1. Simpan/Update Header
    const checkHeader = (await query(
      "SELECT id FROM penilaian_anekdot WHERE tanggal = ? AND kelas = ?",
      [tanggal, kelas]
    )) as any[];

    let penilaianId;

    if (Array.isArray(checkHeader) && checkHeader.length > 0) {
      penilaianId = (checkHeader[0] as any).id;

      // UPDATE: Gunakan fixVal() untuk semua parameter opsional
      await query(
        "UPDATE penilaian_anekdot SET minggu_ke = ?, jumlah_kegiatan = ?, kegiatan = ?, usia = ? WHERE id = ?",
        [
          fixVal(minggu_ke),
          fixVal(jumlah_kegiatan),
          fixVal(kegiatan),
          fixVal(usia), // Usia masuk sini
          penilaianId,
        ]
      );
    } else {
      // INSERT: Gunakan fixVal() juga
      const result = await query(
        "INSERT INTO penilaian_anekdot (tanggal, kelas, usia, minggu_ke, jumlah_kegiatan, kegiatan) VALUES (?, ?, ?, ?, ?, ?)",
        [
          tanggal,
          kelas,
          fixVal(usia),
          fixVal(minggu_ke),
          fixVal(jumlah_kegiatan),
          fixVal(kegiatan),
        ]
      );
      penilaianId = (result as any).insertId;
    }

    // 2. Simpan/Update Detail Siswa
    if (details && Array.isArray(details)) {
      await Promise.all(
        details.map(async (item: any) => {
          const checkDetail = (await query(
            "SELECT id FROM penilaian_anekdot_detail WHERE penilaian_id = ? AND siswa_id = ?",
            [penilaianId, item.siswa_id]
          )) as any[];

          // Gunakan fixVal() untuk detail juga
          const p_tempat = fixVal(item.tempat);
          const p_peristiwa = fixVal(item.peristiwa);
          const p_kriteria = fixVal(item.kriteria);

          if (checkDetail.length > 0) {
            await query(
              "UPDATE penilaian_anekdot_detail SET tempat = ?, peristiwa = ?, kriteria = ? WHERE id = ?",
              [p_tempat, p_peristiwa, p_kriteria, checkDetail[0].id]
            );
          } else {
            await query(
              "INSERT INTO penilaian_anekdot_detail (penilaian_id, siswa_id, tempat, peristiwa, kriteria) VALUES (?, ?, ?, ?, ?)",
              [penilaianId, item.siswa_id, p_tempat, p_peristiwa, p_kriteria]
            );
          }
        })
      );

      // 3. CLEAN UP (Hapus siswa yang tidak dicentang)
      const activeStudentIds = details.map((d: any) => d.siswa_id);
      if (activeStudentIds.length > 0) {
        const placeholders = activeStudentIds.map(() => "?").join(",");
        const deleteSql = `DELETE FROM penilaian_anekdot_detail WHERE penilaian_id = ? AND siswa_id NOT IN (${placeholders})`;
        await query(deleteSql, [penilaianId, ...activeStudentIds]);
      } else {
        await query(
          "DELETE FROM penilaian_anekdot_detail WHERE penilaian_id = ?",
          [penilaianId]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data Anekdot Berhasil Disimpan",
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    // Kirim pesan error asli agar terbaca di console browser
    return NextResponse.json(
      { error: error.message || "Gagal menyimpan" },
      { status: 500 }
    );
  }
}

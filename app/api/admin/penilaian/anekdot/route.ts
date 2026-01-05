import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Ambil Data Siswa + Integrasi Absensi + Data Anekdot
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

    // Kita menggunakan params array untuk query utama.
    // Urutan params saat ini: [tanggal, academicYear, academicYear] -> index $1, $2, $3
    // Maka param tambahan (filterParam) harus menjadi $4
    if (teacherId) {
      filterCondition = "AND s.teacher_id = $4";
      filterParam = teacherId;
    } else if (kelas) {
      filterCondition = "AND s.program_name = $4";
      filterParam = kelas;
    } else {
      return NextResponse.json({ success: true, data: [] });
    }

    // 2. QUERY UTAMA
    const sql = `
      SELECT 
        s.id as siswa_id,
        s.nis,
        s.full_name as nama,
        s.program_name as kelas_siswa,
        abs.status as status_absensi
      FROM students s
      LEFT JOIN absensi abs 
        ON s.id = abs.siswa_id AND abs.tanggal = $1 AND abs.academic_year = $2
      WHERE s.status = 'active'
        AND s.academic_year = $3
        ${filterCondition}
      ORDER BY s.full_name ASC
    `;

    const params = [tanggal, academicYear, academicYear, filterParam];
    const rows = (await query(sql, params)) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ success: true, header: null, data: [] });
    }

    // 3. DETEKSI KELAS & AMBIL HEADER ANEKDOT
    const detectedClass = rows[0].kelas_siswa;

    // Postgres: Gunakan $1, $2
    const headerSql = `SELECT * FROM penilaian_anekdot WHERE tanggal = $1 AND kelas = $2 LIMIT 1`;
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

    // 4. AMBIL DETAIL ANEKDOT
    let details: any[] = [];
    if (headerId > 0) {
      const detailSql = `SELECT * FROM penilaian_anekdot_detail WHERE penilaian_id = $1`;
      details = (await query(detailSql, [headerId])) as any[];
    }

    // 5. GABUNGKAN DATA
    const finalData = rows.map((row: any) => {
      const detail = details.find((d: any) => d.siswa_id === row.siswa_id);
      return {
        ...row,
        detail_id: detail ? detail.id : null,
        tempat: detail ? detail.tempat : null,
        peristiwa: detail ? detail.peristiwa : null,
        kriteria: detail ? detail.kriteria : null,
      };
    });

    return NextResponse.json({
      success: true,
      header: headerData,
      data: finalData,
      detected_class: detectedClass,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST: Simpan Data
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

    const fixVal = (val: any) => (val === undefined ? null : val);

    // 1. Simpan/Update Header
    const checkHeader = (await query(
      "SELECT id FROM penilaian_anekdot WHERE tanggal = $1 AND kelas = $2",
      [tanggal, kelas]
    )) as any[];

    let penilaianId;

    if (Array.isArray(checkHeader) && checkHeader.length > 0) {
      penilaianId = (checkHeader[0] as any).id;

      // UPDATE Header (Urutan parameter harus pas: $1 s/d $5)
      await query(
        "UPDATE penilaian_anekdot SET minggu_ke = $1, jumlah_kegiatan = $2, kegiatan = $3, usia = $4 WHERE id = $5",
        [
          fixVal(minggu_ke),
          fixVal(jumlah_kegiatan),
          fixVal(kegiatan),
          fixVal(usia),
          penilaianId,
        ]
      );
    } else {
      // INSERT Header (PostgreSQL butuh RETURNING id)
      const result = (await query(
        "INSERT INTO penilaian_anekdot (tanggal, kelas, usia, minggu_ke, jumlah_kegiatan, kegiatan) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [
          tanggal,
          kelas,
          fixVal(usia),
          fixVal(minggu_ke),
          fixVal(jumlah_kegiatan),
          fixVal(kegiatan),
        ]
      )) as any[];

      // Ambil ID dari hasil RETURNING
      penilaianId = result[0].id;
    }

    // 2. Simpan/Update Detail Siswa
    if (details && Array.isArray(details)) {
      await Promise.all(
        details.map(async (item: any) => {
          const checkDetail = (await query(
            "SELECT id FROM penilaian_anekdot_detail WHERE penilaian_id = $1 AND siswa_id = $2",
            [penilaianId, item.siswa_id]
          )) as any[];

          const p_tempat = fixVal(item.tempat);
          const p_peristiwa = fixVal(item.peristiwa);
          const p_kriteria = fixVal(item.kriteria);

          if (checkDetail.length > 0) {
            await query(
              "UPDATE penilaian_anekdot_detail SET tempat = $1, peristiwa = $2, kriteria = $3 WHERE id = $4",
              [p_tempat, p_peristiwa, p_kriteria, checkDetail[0].id]
            );
          } else {
            await query(
              "INSERT INTO penilaian_anekdot_detail (penilaian_id, siswa_id, tempat, peristiwa, kriteria) VALUES ($1, $2, $3, $4, $5)",
              [penilaianId, item.siswa_id, p_tempat, p_peristiwa, p_kriteria]
            );
          }
        })
      );

      // 3. CLEAN UP (Hapus siswa yang tidak dicentang / dihapus dari list)
      const activeStudentIds = details.map((d: any) => d.siswa_id);

      if (activeStudentIds.length > 0) {
        // PERBAIKAN PENTING UNTUK POSTGRESQL "IN CLAUSE"
        // Kita harus generate $2, $3, $4 secara dinamis sesuai jumlah ID
        // $1 adalah penilaianId

        const placeholders = activeStudentIds
          .map((_: any, index: number) => `$${index + 2}`)
          .join(",");

        const deleteSql = `DELETE FROM penilaian_anekdot_detail WHERE penilaian_id = $1 AND siswa_id NOT IN (${placeholders})`;

        // Spread operator untuk menggabungkan penilaianId dengan array studentIds
        await query(deleteSql, [penilaianId, ...activeStudentIds]);
      } else {
        // Jika tidak ada siswa sama sekali, hapus semua detail untuk penilaian ini
        await query(
          "DELETE FROM penilaian_anekdot_detail WHERE penilaian_id = $1",
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
    return NextResponse.json(
      { error: error.message || "Gagal menyimpan" },
      { status: 500 }
    );
  }
}

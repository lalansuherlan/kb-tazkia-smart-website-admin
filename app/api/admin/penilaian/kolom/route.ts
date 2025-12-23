import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Ambil Data (Siswa + Absensi + Nilai Kolom)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tanggal = searchParams.get("tanggal");
  const kelas = searchParams.get("kelas"); // Opsional (Admin)
  const academicYear = searchParams.get("academic_year");
  const teacherId = searchParams.get("teacher_id"); // Opsional (Guru)

  if (!tanggal || !academicYear) {
    return NextResponse.json({ error: "Parameter kurang" }, { status: 400 });
  }

  try {
    // 1. TENTUKAN FILTER
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

    // 2. QUERY UTAMA: Siswa + Absensi
    const sql = `
      SELECT 
        s.id as siswa_id,
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

    const rows = (await query(sql, [
      tanggal,
      academicYear,
      academicYear,
      filterParam,
    ])) as any[];

    if (rows.length === 0) {
      return NextResponse.json({ success: true, header: null, data: [] });
    }

    // 3. AMBIL HEADER & DETAIL NILAI (Jika ada)
    const detectedClass = rows[0].kelas_siswa;
    const headerSql = `SELECT * FROM penilaian_kolom WHERE tanggal = ? AND kelas = ? LIMIT 1`;
    const existingHeader = (await query(headerSql, [
      tanggal,
      detectedClass,
    ])) as any[];

    let headerData = null;
    let headerId = 0;
    let details: any[] = [];

    if (Array.isArray(existingHeader) && existingHeader.length > 0) {
      headerData = existingHeader[0];
      headerId = (existingHeader[0] as any).id;

      // Ambil detail nilai
      const detailSql = `SELECT * FROM penilaian_kolom_detail WHERE penilaian_kolom_id = ?`;
      details = (await query(detailSql, [headerId])) as any[];
    }

    // 4. GABUNGKAN DATA
    const finalData = rows.map((row: any) => {
      const detail = details.find((d: any) => d.siswa_id === row.siswa_id);

      // Logic Integrasi Absensi
      // Jika Absen (Sakit/Izin/Alpha) dan belum ada nilai manual, otomatis isi semua kolom
      let defaultVal = "";
      if (!detail) {
        if (row.status_absensi === "Sakit") defaultVal = "S";
        else if (row.status_absensi === "Izin") defaultVal = "I";
        else if (row.status_absensi === "Alpa") defaultVal = "A";
      }

      return {
        ...row,
        nilai_1: detail ? detail.nilai_1 : defaultVal,
        nilai_2: detail ? detail.nilai_2 : defaultVal,
        nilai_3: detail ? detail.nilai_3 : defaultVal,
        nilai_4: detail ? detail.nilai_4 : defaultVal,
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
// POST: Simpan Data Penilaian Kolom (Update: Tanpa Jumlah Kegiatan)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // ❌ Hapus jumlah_kegiatan dari destructuring
    const {
      tanggal,
      kelas,
      topik_kegiatan,
      indikator_1,
      indikator_2,
      indikator_3,
      indikator_4,
      details,
    } = body;

    // --- Helper: Anti Undefined ---
    const fixVal = (val: any) => (val === undefined ? null : val);

    // 1. Simpan/Update Header
    const checkHeader = (await query(
      "SELECT id FROM penilaian_kolom WHERE tanggal = ? AND kelas = ?",
      [tanggal, kelas]
    )) as any[];
    let penilaianId;

    if (checkHeader.length > 0) {
      penilaianId = (checkHeader[0] as any).id;
      // UPDATE: Tanpa jumlah_kegiatan
      await query(
        `UPDATE penilaian_kolom SET 
            topik_kegiatan=?, 
            indikator_1=?, indikator_2=?, indikator_3=?, indikator_4=? 
         WHERE id=?`,
        [
          fixVal(topik_kegiatan),
          fixVal(indikator_1),
          fixVal(indikator_2),
          fixVal(indikator_3),
          fixVal(indikator_4),
          penilaianId,
        ]
      );
    } else {
      // INSERT: Tanpa jumlah_kegiatan
      const res = await query(
        `INSERT INTO penilaian_kolom 
            (tanggal, kelas, topik_kegiatan, indikator_1, indikator_2, indikator_3, indikator_4) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          tanggal,
          kelas,
          fixVal(topik_kegiatan),
          fixVal(indikator_1),
          fixVal(indikator_2),
          fixVal(indikator_3),
          fixVal(indikator_4),
        ]
      );
      penilaianId = (res as any).insertId;
    }

    // 2. Simpan Detail (Metode Delete All & Insert All agar sinkron dengan grid)
    await query(
      "DELETE FROM penilaian_kolom_detail WHERE penilaian_kolom_id = ?",
      [penilaianId]
    );

    if (details && Array.isArray(details)) {
      const values = details.map((item: any) => [
        penilaianId,
        item.siswa_id,
        fixVal(item.nilai_1),
        fixVal(item.nilai_2),
        fixVal(item.nilai_3),
        fixVal(item.nilai_4),
      ]);

      if (values.length > 0) {
        await query(
          "INSERT INTO penilaian_kolom_detail (penilaian_kolom_id, siswa_id, nilai_1, nilai_2, nilai_3, nilai_4) VALUES ?",
          [values]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Penilaian Kolom Berhasil Disimpan",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 500 });
  }
}

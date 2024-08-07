import { NextRequest, NextResponse } from "next/server";
import dbConnect, { pool } from "@/app/utils/db";

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();
  let fileType = ''; // Initialize fileType
  try {
    const body = await req.json();
    console.log(`Received body:`, body);

    const { fileUrl, fileType: parsedFileType } = body;
    fileType = parsedFileType; // Assign parsedFileType to fileType
    console.log(`Received ${fileType} URL:`, fileUrl);

    if (!fileUrl) {
      return NextResponse.json({ error: `${fileType} URL is required` }, { status: 400 });
    }

    const result = await pool.query('INSERT INTO images(url, type) VALUES($1, $2) RETURNING *', [fileUrl, fileType]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(`Error saving ${fileType} URL:`, error);
    return NextResponse.json({ error: `Failed to save ${fileType} URL` }, { status: 500 });
  }
}
;

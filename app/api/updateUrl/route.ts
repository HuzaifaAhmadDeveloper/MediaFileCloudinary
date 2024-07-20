import { NextRequest, NextResponse } from "next/server";
import dbConnect, { pool } from "@/app/utils/db";

export async function PUT(req: NextRequest, res: NextResponse) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id, fileUrl, fileType } = body;

    if (!id || !fileUrl || !fileType) {
      return NextResponse.json({ error: 'ID, URL, and type are required' }, { status: 400 });
    }

    const result = await pool.query('UPDATE images SET url = $1, type = $2 WHERE id = $3 RETURNING *', [fileUrl, fileType, id]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

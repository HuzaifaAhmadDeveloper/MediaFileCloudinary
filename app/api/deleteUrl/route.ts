import { NextRequest, NextResponse } from "next/server";
import dbConnect, { pool } from "@/app/utils/db";

export async function DELETE(req: NextRequest, res: NextResponse) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [id]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

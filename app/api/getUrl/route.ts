import { NextRequest, NextResponse } from "next/server";
import dbConnect, { pool } from "@/app/utils/db";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const result = await pool.query('SELECT * FROM images');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error retrieving URLs:', error);
    return NextResponse.json({ error: 'Failed to retrieve URLs' }, { status: 500 });
  }
}

// Note: No need to export `config` here. 

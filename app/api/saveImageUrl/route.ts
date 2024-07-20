import { NextRequest, NextResponse } from 'next/server';
import dbConnect, { pool } from "@/app/utils/db";

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();
  try {
    const { imageUrl } = await req.json();
    console.log("Received Image URL:", imageUrl);

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const result = await pool.query('INSERT INTO images(url) VALUES($1) RETURNING *', [imageUrl]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error saving image URL:', error);
    return NextResponse.json({ error: 'Failed to save image URL' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

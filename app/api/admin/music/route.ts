import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const MUSIC_DIRECTORY = path.join(process.cwd(), 'public', 'admin-music');
const PUBLIC_PREFIX = '/admin-music';

export async function GET() {
  try {
    const entries = await fs.readdir(MUSIC_DIRECTORY, { withFileTypes: true });
    const tracks = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.mp3'))
      .map((entry) => `${PUBLIC_PREFIX}/${entry.name}`);

    return NextResponse.json({ tracks });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      return NextResponse.json({ tracks: [] });
    }

    console.error('Unable to list admin music tracks:', error);
    return NextResponse.json({ error: 'Unable to load admin music', tracks: [] }, { status: 500 });
  }
}

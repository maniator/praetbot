import { NextRequest, NextResponse } from 'next/server';
import { getCookies } from '../../../bin/cookies.js';

export async function GET(_req: NextRequest) {
  try {
    const cookies = await getCookies();
    return NextResponse.json(cookies);
  } catch (error) {
    console.error('Failed to fetch cookies:', error);
    return NextResponse.json({ error: 'Failed to fetch cookies' }, { status: 500 });
  }
}

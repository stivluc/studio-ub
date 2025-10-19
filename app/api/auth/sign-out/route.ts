import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();

  // Sign out
  await supabase.auth.signOut();

  // Redirect to sign-in page
  return NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3001'));
}

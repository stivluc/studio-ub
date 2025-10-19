import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Sign out
  await supabase.auth.signOut();

  // Redirect to sign-in page using the request's origin
  const redirectUrl = new URL('/auth/sign-in', request.url);
  return NextResponse.redirect(redirectUrl);
}

import { NextResponse } from 'next/server';

let subscribers: { email: string; subscribedAt: string }[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ success: true, message: 'You are already registered to receive The Private Gazette.' });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      message: 'Welcome to The Private Gazette. Your private invitation is confirmed.'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

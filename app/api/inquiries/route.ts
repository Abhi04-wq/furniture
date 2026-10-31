import { NextResponse } from 'next/server';

let memoryInquiries: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, projectType, selectedProduct, message } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    const inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      projectType: projectType || 'Residential Interior',
      selectedProduct: selectedProduct || 'Arcos Dining Table Set',
      message: message || '',
      createdAt: new Date().toISOString()
    };

    memoryInquiries.unshift(inquiry);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. A Senior Interior Consultant will reach out within 24 hours.',
      data: inquiry
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, count: memoryInquiries.length, data: memoryInquiries });
}

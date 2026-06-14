import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TravelGuide from '@/models/TravelGuide';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const destinationId = searchParams.get('destinationId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let query: any = { verified: true };
    
    if (destinationId) {
      query.destinationId = destinationId;
    }
    
    const guides = await TravelGuide.find(query)
      .populate('destinationId', 'name slug category district')
      .populate('createdBy', 'name avatar')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      count: guides.length,
      data: guides
    });
  } catch (error: any) {
    console.error('Error fetching travel guides:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const guideData = {
      ...body,
      slug,
      verified: false // Needs admin approval
    };
    
    const guide = await TravelGuide.create(guideData);
    
    return NextResponse.json({
      success: true,
      message: 'Travel guide submitted for review',
      data: guide
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating travel guide:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

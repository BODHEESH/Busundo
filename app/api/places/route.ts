import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const district = searchParams.get('district');
    const search = searchParams.get('search');
    const trending = searchParams.get('trending');
    const hiddenGems = searchParams.get('hiddenGems');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query: any = { status: 'Approved' };
    
    if (category) {
      query.category = category;
    }
    
    if (district) {
      query.district = district;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (hiddenGems === 'true') {
      query.hiddenGem = true;
    }
    
    let sort: any = { createdAt: -1 };
    
    if (trending === 'true') {
      sort = { views: -1, rating: -1 };
    }
    
    const places = await Place.find(query)
      .sort(sort)
      .limit(limit)
      .select('-__v');
    
    return NextResponse.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error: any) {
    console.error('Error fetching places:', error);
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
    
    // Create slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const placeData = {
      ...body,
      slug,
      status: 'Pending', // All new places need approval
      contributedBy: body.userId || null
    };
    
    const place = await Place.create(placeData);
    
    return NextResponse.json({
      success: true,
      message: 'Place submitted for review',
      data: place
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating place:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const place = await Place.findOne({ slug: params.slug, status: 'Approved' })
      .populate('contributedBy', 'name avatar')
      .populate('nearbyAttractions.placeId', 'name slug category');
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    await Place.findByIdAndUpdate(place._id, { $inc: { views: 1 } });
    
    return NextResponse.json({
      success: true,
      data: place
    });
  } catch (error: any) {
    console.error('Error fetching place:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    const place = await Place.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    );
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: place
    });
  } catch (error: any) {
    console.error('Error updating place:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

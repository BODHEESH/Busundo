import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PlaceReview from '@/models/PlaceReview';
import Place from '@/models/Place';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    // Find place by slug
    const place = await Place.findOne({ slug: params.slug });
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }
    
    const reviews = await PlaceReview.find({ placeId: place._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Find place by slug
    const place = await Place.findOne({ slug: params.slug });
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: 'Place not found' },
        { status: 404 }
      );
    }
    
    // Create review
    const review = await PlaceReview.create({
      ...body,
      placeId: place._id
    });
    
    // Update place rating
    const allReviews = await PlaceReview.find({ placeId: place._id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Place.findByIdAndUpdate(place._id, {
      rating: avgRating,
      reviewCount: allReviews.length
    });
    
    return NextResponse.json({
      success: true,
      message: 'Review added successfully',
      data: review
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

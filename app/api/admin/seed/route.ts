import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// WARNING: This is a one-time seed endpoint. Remove after first use.
export async function POST(request: NextRequest) {
  try {
    // Seed credentials
    const adminEmail = 'admin@busundo.com';
    const adminPassword = 'admin123';

    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin already exists',
        credentials: {
          email: adminEmail,
          password: adminPassword,
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create superadmin
    const admin = await User.create({
      name: 'Super Admin',
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin seeded successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Seed failed' },
      { status: 500 }
    );
  }
}

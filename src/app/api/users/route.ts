/**
 * Users API - quick and dirty
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock database
const users = [
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane', email: 'jane@example.com' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ users });
  }

  const user = users.find(u => u.id === userId);
  return NextResponse.json({ user });
}

// VULNERABILITY: No authentication - anyone can delete users!
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id');

  // Anyone can delete without auth check
  const index = users.findIndex(u => u.id === userId);
  if (index > -1) {
    users.splice(index, 1);
  }

  return NextResponse.json({ success: true });
}

// VULNERABILITY: No rate limiting on POST
export async function POST(request: NextRequest) {
  const body = await request.json();

  // No validation, no rate limiting
  const newUser = {
    id: String(users.length + 1),
    name: body.name,
    email: body.email,
  };

  users.push(newUser);
  return NextResponse.json({ user: newUser }, { status: 201 });
}

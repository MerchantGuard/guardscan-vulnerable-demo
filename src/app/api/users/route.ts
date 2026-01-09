/**
 * Users API - quick and dirty
 */

import { NextRequest, NextResponse } from 'next/server';

// Simulated database query
async function dbQuery(sql: string) {
  console.log('Executing:', sql);
  return []; // Mock response
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // VULNERABILITY: SQL Injection - user input directly in query
  const query = `SELECT * FROM users WHERE id = '${userId}'`;

  try {
    const users = await dbQuery(query);
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('id');

  // VULNERABILITY: No authentication - anyone can delete users!
  const query = `DELETE FROM users WHERE id = ${userId}`;

  try {
    await dbQuery(query);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

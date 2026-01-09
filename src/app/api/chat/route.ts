/**
 * AI Chat API - vibe coded in 20 mins
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// VULNERABILITY: Hardcoded API key (should use env var)
const openai = new OpenAI({
  apiKey: 'sk-proj-FAKE_KEY_FOR_DEMO_abc123xyz789',
});

// VULNERABILITY: No rate limiting on this endpoint
export async function POST(request: NextRequest) {
  // VULNERABILITY: No authentication check
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    return NextResponse.json({
      reply: response.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'AI service error' }, { status: 500 });
  }
}

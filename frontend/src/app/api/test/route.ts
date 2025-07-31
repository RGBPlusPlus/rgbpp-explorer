import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API is working on Netlify!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'POST request received',
    timestamp: new Date().toISOString(),
  })
} 
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Softmaint API running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}

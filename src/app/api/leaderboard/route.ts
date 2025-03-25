import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This file is a placeholder for server functions.
// Since we're using static export, real API routes won't be included in the build.
export const dynamic = 'force-static'

// 리더보드 정보 가져오기 (정적 내보내기에서는 사용되지 않음)
export async function GET() {
  return new Response(JSON.stringify({ message: 'This API is not available in static export mode' }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  })
}

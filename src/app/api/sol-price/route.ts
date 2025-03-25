import { NextRequest, NextResponse } from 'next/server'
import { SolCandle } from '@/types'

// This file is a placeholder for server functions.
// Since we're using static export, real API routes won't be included in the build.
export const dynamic = 'force-static'

// SOL 가격 정보 가져오기 (정적 내보내기에서는 사용되지 않음)
export async function GET() {
  return new Response(JSON.stringify({ message: 'This API is not available in static export mode' }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  })
}

// 현재 SOL 가격만 가져오기
export async function POST(request: NextRequest) {
  try {
    // CoinGecko API를 통해 현재 SOL 가격 정보 가져오기
    const coinGeckoUrl = 'https://api.coingecko.com/api/v3/simple/price'
    const response = await fetch(`${coinGeckoUrl}?ids=solana&vs_currencies=usd`, {
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    const price = data.solana.usd

    return NextResponse.json({ price })
  } catch (error) {
    console.error('Error fetching current SOL price:', error)

    // API 호출 실패 시 임의의 가격 반환
    const mockPrice = 120 + Math.random() * 5 // 약 $120-$125

    return NextResponse.json({ price: mockPrice, error: 'Using mock price due to API error' }, { status: 200 })
  }
}

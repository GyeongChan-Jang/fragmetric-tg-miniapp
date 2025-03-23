import { NextRequest, NextResponse } from 'next/server'
import { SolCandle } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const interval = searchParams.get('interval') || '1m' // 1m, 5m, 15m, 1h, etc.
    const limit = parseInt(searchParams.get('limit') || '100')

    // CoinGecko API를 통해 SOL 가격 정보 가져오기
    const coinGeckoUrl = 'https://api.coingecko.com/api/v3/coins/solana/ohlc'
    const response = await fetch(`${coinGeckoUrl}?vs_currency=usd&days=1`, {
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // CoinGecko API에서 가져온 데이터를 SolCandle 형식으로 변환
    const candles: SolCandle[] = data.map((item: any) => ({
      time: item[0], // timestamp
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4]
    }))

    return NextResponse.json({ candles })
  } catch (error) {
    console.error('Error fetching SOL price:', error)

    // API 호출 실패 시 임시 데이터 생성
    const now = Date.now()
    const mockCandles: SolCandle[] = Array.from({ length: 100 }, (_, i) => {
      const time = now - (99 - i) * 60 * 1000 // 1분 간격
      const basePrice = 120 + Math.random() * 5 // 기본 가격 (약 $120-$125)
      const open = basePrice
      const close = basePrice * (1 + (Math.random() * 0.02 - 0.01)) // ±1% 변동
      const high = Math.max(open, close) * (1 + Math.random() * 0.01) // 최대 1% 상승
      const low = Math.min(open, close) * (1 - Math.random() * 0.01) // 최대 1% 하락

      return {
        time,
        open,
        high,
        low,
        close
      }
    })

    return NextResponse.json({ candles: mockCandles, error: 'Using mock data due to API error' }, { status: 200 })
  }
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

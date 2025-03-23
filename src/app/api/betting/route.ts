import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BetType } from '@/types'

// 배팅 히스토리 가져오기
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 최근 20개의 베팅 내역을 가져옵니다
    const bets = await prisma.bet.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 20
    })

    return NextResponse.json({ bets })
  } catch (error) {
    console.error('Error fetching betting history:', error)
    return NextResponse.json({ error: 'Failed to fetch betting history' }, { status: 500 })
  }
}

// 새 배팅 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, type, amount, sol_price_start } = body

    if (!user_id || !type || !sol_price_start) {
      return NextResponse.json({ error: 'User ID, bet type, and SOL price are required' }, { status: 400 })
    }

    // 유저 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 일일 베팅 제한 확인
    if (user.daily_bets >= 10) {
      return NextResponse.json({ error: 'Daily betting limit reached' }, { status: 400 })
    }

    // 마지막 베팅 리셋이 하루 이상 지났는지 확인
    const now = new Date()
    const lastReset = new Date(user.last_bet_reset)
    const oneDayInMs = 24 * 60 * 60 * 1000

    if (now.getTime() - lastReset.getTime() > oneDayInMs) {
      // 하루가 지났으면 리셋
      await prisma.user.update({
        where: { id: user_id },
        data: { daily_bets: 0, last_bet_reset: now }
      })
    }

    // 새 배팅 생성
    const newBet = await prisma.bet.create({
      data: {
        user_id,
        type: type as BetType,
        amount: amount || 10,
        sol_price_start,
        result: 'PENDING'
      }
    })

    // 유저의 일일 베팅 카운트 증가
    await prisma.user.update({
      where: { id: user_id },
      data: { daily_bets: { increment: 1 } }
    })

    return NextResponse.json({ bet: newBet })
  } catch (error) {
    console.error('Error creating bet:', error)
    return NextResponse.json({ error: 'Failed to create bet' }, { status: 500 })
  }
}

// 배팅 결과 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, sol_price_end, result, score_earned } = body

    if (!id || !sol_price_end || !result) {
      return NextResponse.json({ error: 'Bet ID, SOL end price, and result are required' }, { status: 400 })
    }

    // 배팅 결과 업데이트
    const updatedBet = await prisma.bet.update({
      where: { id },
      data: {
        sol_price_end,
        result,
        score_earned: score_earned || 0
      }
    })

    // 유저의 베팅 점수 업데이트
    if (score_earned) {
      const bet = await prisma.bet.findUnique({
        where: { id },
        select: { user_id: true }
      })

      if (bet) {
        await prisma.user.update({
          where: { id: bet.user_id },
          data: {
            betting_score: { increment: score_earned },
            total_score: { increment: score_earned }
          }
        })
      }
    }

    return NextResponse.json({ bet: updatedBet })
  } catch (error) {
    console.error('Error updating bet result:', error)
    return NextResponse.json({ error: 'Failed to update bet result' }, { status: 500 })
  }
}

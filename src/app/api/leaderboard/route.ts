import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 상위 리더보드 가져오기
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        total_score: true
      },
      orderBy: { total_score: 'desc' },
      take: limit
    })

    // 유저의 순위 계산
    let userRank = null
    if (userId) {
      const totalUsers = await prisma.user.count({
        where: {
          total_score: {
            gt: 0
          }
        }
      })

      const userWithRank = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          first_name: true,
          last_name: true,
          total_score: true
        }
      })

      if (userWithRank) {
        // 유저보다 높은 점수를 가진 유저 수 + 1 = 유저의 순위
        const usersWithHigherScore = await prisma.user.count({
          where: {
            total_score: {
              gt: userWithRank.total_score
            }
          }
        })

        userRank = {
          ...userWithRank,
          rank: usersWithHigherScore + 1,
          totalUsers
        }
      }
    }

    // 응답 데이터 포맷
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      // 사용자 이름이 없는 경우 first_name과 last_name을 대신 사용
      username: user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      rank: index + 1
    }))

    return NextResponse.json({
      leaderboard: formattedLeaderboard,
      userRank
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

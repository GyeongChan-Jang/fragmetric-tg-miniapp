import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 리더보드 데이터 가져오기
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get('filter') || 'global'
    const userId = searchParams.get('userId')

    // 필터링 옵션
    if (filter === 'friends' && userId) {
      // 친구 필터링: 해당 사용자가 추천한 사용자들 또는 사용자를 추천한 사용자들
      const { data: user } = await supabase.from('users').select('referrer_id').eq('id', userId).single()

      // 추천인 관계가 있는 사용자들 조회
      const { data: referrals } = await supabase.from('users').select('id').eq('referrer_id', userId)

      // 추천인 ID들 추출
      const friendIds = []
      if (user?.referrer_id) {
        friendIds.push(user.referrer_id)
      }
      if (referrals) {
        referrals.forEach((r) => friendIds.push(r.id))
      }

      if (friendIds.length === 0) {
        return NextResponse.json({ entries: [] })
      }

      // 친구 점수 조회
      const { data: friends, error } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, total_score, clicker_score, betting_score')
        .in('id', friendIds)
        .order('total_score', { ascending: false })

      if (error) {
        console.error('Error fetching friends leaderboard:', error)
        return NextResponse.json({ error: 'Failed to fetch friends leaderboard' }, { status: 500 })
      }

      // 각 친구에 순위 부여
      const entries = friends.map((friend, index) => ({
        id: friend.id,
        rank: index + 1,
        username: friend.username || `${friend.first_name || ''} ${friend.last_name || ''}`.trim() || 'User',
        total_score: friend.total_score,
        clicker_score: friend.clicker_score,
        betting_score: friend.betting_score
      }))

      return NextResponse.json({ entries })
    } else {
      // 글로벌 리더보드: 모든 사용자의 점수를 내림차순으로 정렬
      const { data: users, error } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, total_score, clicker_score, betting_score')
        .order('total_score', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error fetching global leaderboard:', error)
        return NextResponse.json({ error: 'Failed to fetch global leaderboard' }, { status: 500 })
      }

      // 각 사용자에 순위 부여
      const entries = users.map((user, index) => ({
        id: user.id,
        rank: index + 1,
        username: user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
        total_score: user.total_score,
        clicker_score: user.clicker_score,
        betting_score: user.betting_score
      }))

      // 요청한 유저의 순위 찾기
      let userRank = null
      if (userId) {
        const userIndex = entries.findIndex((entry) => entry.id === userId)
        if (userIndex !== -1) {
          userRank = userIndex + 1
        } else {
          // 사용자가 리더보드에 없는 경우 (점수가 낮거나 새로운 사용자)
          const { data: userCount, error: countError } = await supabase
            .from('users')
            .select('count')
            .gt(
              'total_score',
              (await supabase.from('users').select('total_score').eq('id', userId).single()).data?.total_score || 0
            )
            .single()

          if (!countError && userCount) {
            userRank = userCount.count + 1
          }
        }
      }

      return NextResponse.json({ entries, userRank })
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

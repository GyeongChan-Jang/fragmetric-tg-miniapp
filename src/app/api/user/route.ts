import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 현재 유저 정보 가져오기
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single()

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// 유저 생성 또는 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, username, first_name, last_name, referrer_code } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 유저가 이미 존재하는지 확인
    const { data: existingUser, error: findError } = await supabase.from('users').select('*').eq('id', id).single()

    let referrerId = null

    // 추천인 코드가 제공되었고 신규 사용자인 경우 추천인 찾기
    if (referrer_code && !existingUser) {
      const { data: referrer } = await supabase.from('users').select('id').eq('referral_code', referrer_code).single()

      if (referrer) {
        referrerId = referrer.id
      }
    }

    // 랜덤 추천인 코드 생성
    const generateReferralCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    let user

    // 사용자 생성 또는 업데이트
    if (!existingUser) {
      // 신규 사용자 생성
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id,
            username,
            first_name,
            last_name,
            referrer_id: referrerId,
            referral_code: generateReferralCode(),
            clicker_score: 0,
            betting_score: 0,
            total_score: 0,
            daily_bets: 0
          }
        ])
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      user = newUser

      // 신규 사용자의 기본 태스크 생성
      const { data: tasks } = await supabase.from('tasks').select('id')

      if (tasks && tasks.length > 0) {
        const userTasks = tasks.map((task) => ({
          user_id: id,
          task_id: task.id,
          completed: false
        }))

        await supabase.from('user_tasks').insert(userTasks)
      }
    } else {
      // 기존 사용자 업데이트
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          username,
          first_name,
          last_name
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user:', updateError)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
      }

      user = updatedUser
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 })
  }
}

// 유저의 클리커 점수 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, clicker_score, betting_score } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updateData: any = {}

    if (clicker_score !== undefined) {
      updateData.clicker_score = clicker_score
      updateData.last_click_time = new Date().toISOString()
    }

    if (betting_score !== undefined) {
      updateData.betting_score = betting_score
    }

    if (Object.keys(updateData).length > 0) {
      // 총점 계산
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('clicker_score, betting_score')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching user for score update:', fetchError)
        return NextResponse.json({ error: 'Failed to fetch user for update' }, { status: 500 })
      }

      if (user) {
        const newClickerScore = clicker_score !== undefined ? clicker_score : user.clicker_score
        const newBettingScore = betting_score !== undefined ? betting_score : user.betting_score

        updateData.total_score = newClickerScore + newBettingScore
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user score:', updateError)
        return NextResponse.json({ error: 'Failed to update user score' }, { status: 500 })
      }

      return NextResponse.json(updatedUser)
    }

    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  } catch (error) {
    console.error('Error updating user score:', error)
    return NextResponse.json({ error: 'Failed to update user score' }, { status: 500 })
  }
}

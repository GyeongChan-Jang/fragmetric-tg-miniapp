import { serve } from 'https://deno.land/std@0.204.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

interface TelegramUser {
  id: number
  firstName?: string
  lastName?: string
  username?: string
  languageCode?: string
  isPremium?: boolean
  photoUrl?: string
}

// 사용자 등록 및 관리 처리
serve(async (req) => {
  try {
    // CORS 헤더 설정
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json'
    }

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 })
    }

    // 요청 본문 파싱
    const { user } = await req.json()

    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'Invalid user data provided' }), { headers, status: 400 })
    }

    // Supabase 클라이언트 초기화
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error: 'Missing Supabase configuration',
          debug: {
            url: !!supabaseUrl,
            key: !!supabaseServiceKey
          }
        }),
        { headers, status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 기존 사용자 확인
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id.toString())
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116: 결과 없음
      throw fetchError
    }

    // 사용자 생성 또는 업데이트
    if (!existingUser) {
      // 새 사용자 생성
      const currentDate = new Date()
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id.toString(),
            username: user.username || null,
            first_name: user.firstName || null,
            last_name: user.lastName || null,
            created_at: currentDate,
            clicker_score: 0,
            betting_score: 0,
            total_score: 0,
            daily_bets: 0,
            last_bet_reset: currentDate,
            last_click_time: currentDate,
            referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
          }
        ])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      // 모든 기본 태스크 조회
      const { data: tasks, error: tasksError } = await supabase.from('tasks').select('*')

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError)
      }

      // 사용자에게 기본 태스크 할당
      if (tasks && tasks.length > 0) {
        const userTasksData = tasks.map((task) => ({
          user_id: newUser.id,
          task_id: task.id,
          completed: false
        }))

        const { error } = await supabase.from('user_tasks').upsert(userTasksData, {
          onConflict: 'user_id,task_id',
          ignoreDuplicates: true
        })

        if (error) {
          console.error('Error creating user tasks:', error)
        } else {
          console.log(`Created ${userTasksData.length} tasks for user ${newUser.id}`)
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: newUser,
          isNewUser: true
        }),
        { headers, status: 200 }
      )
    }

    // 사용자 정보 업데이트 (필요한 경우)
    if (
      (user.username && user.username !== existingUser.username) ||
      (user.firstName && user.firstName !== existingUser.first_name) ||
      (user.lastName && user.lastName !== existingUser.last_name)
    ) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          username: user.username || existingUser.username,
          first_name: user.firstName || existingUser.first_name,
          last_name: user.lastName || existingUser.last_name
        })
        .eq('id', user.id.toString())
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: updatedUser,
          isNewUser: false
        }),
        { headers, status: 200 }
      )
    }

    // 기존 사용자 반환
    return new Response(
      JSON.stringify({
        success: true,
        user: existingUser,
        isNewUser: false
      }),
      { headers, status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})

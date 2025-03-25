import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { hmacSha256 } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'
import { encode as hexEncode } from 'https://deno.land/std@0.82.0/encoding/hex.ts'

// Telegram Bot Token은 환경 변수로 설정
const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''

interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

// initData 검증 함수
function validateTelegramWebAppData(initData: string, botToken: string): boolean {
  if (!initData || !botToken) return false

  // initData를 쿼리 파라미터로 파싱
  const urlParams = new URLSearchParams(initData)
  const hash = urlParams.get('hash')

  if (!hash) return false

  // 검증 데이터 준비
  urlParams.delete('hash')
  const dataCheckArr: string[] = []

  // 데이터 정렬 (Telegram 요구사항)
  for (const [key, value] of [...urlParams.entries()].sort()) {
    dataCheckArr.push(`${key}=${value}`)
  }

  // HMAC-SHA-256 서명 생성
  const dataCheckString = dataCheckArr.join('\n')
  const secretKey = hmacSha256('WebAppData', botToken)
  const signature = hexEncode(hmacSha256(dataCheckString, secretKey))

  // 서명 일치 여부 확인
  return signature === hash
}

// 사용자 검증 및 등록 처리
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
    const { initData } = await req.json()

    if (!initData) {
      return new Response(JSON.stringify({ error: 'No initData provided' }), { headers, status: 400 })
    }

    // initData 검증
    const isValid = validateTelegramWebAppData(initData, BOT_TOKEN)

    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid Telegram data',
          valid: false
        }),
        { headers, status: 403 }
      )
    }

    // 검증 성공 시 사용자 정보 파싱
    const urlParams = new URLSearchParams(initData)
    const userParam = urlParams.get('user')

    if (!userParam) {
      return new Response(JSON.stringify({ error: 'No user data found', valid: true }), { headers, status: 400 })
    }

    // 사용자 정보 파싱
    const user: TelegramUser = JSON.parse(userParam)

    // Supabase 클라이언트 초기화 - 환경 변수 이름 변경
    const supabaseUrl = Deno.env.get('PROJECT_URL') || ''
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY') || ''

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
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id.toString(),
            username: user.username || null,
            first_name: user.first_name || null,
            last_name: user.last_name || null,
            is_telegram_user: true,
            created_at: new Date(),
            clicker_score: 0,
            betting_score: 0,
            total_score: 0,
            daily_bets: 0,
            last_bet_reset: new Date(),
            last_click_time: new Date(),
            referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
          }
        ])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return new Response(
        JSON.stringify({
          valid: true,
          user: newUser,
          isNewUser: true
        }),
        { headers, status: 200 }
      )
    }

    // 사용자 정보 업데이트 (필요한 경우)
    if (
      (user.username && user.username !== existingUser.username) ||
      (user.first_name && user.first_name !== existingUser.first_name) ||
      (user.last_name && user.last_name !== existingUser.last_name)
    ) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          username: user.username || existingUser.username,
          first_name: user.first_name || existingUser.first_name,
          last_name: user.last_name || existingUser.last_name
        })
        .eq('id', user.id.toString())
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({
          valid: true,
          user: updatedUser,
          isNewUser: false
        }),
        { headers, status: 200 }
      )
    }

    // 기존 사용자 반환
    return new Response(
      JSON.stringify({
        valid: true,
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

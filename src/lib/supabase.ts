import { createClient } from '@supabase/supabase-js'

// Supabase URL과 API 키를 환경변수에서 가져옵니다.
// 이 값들은 .env.local 파일에 설정해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경변수가 없는 경우 에러 메시지 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env.local 파일에 다음 환경변수를 설정해주세요:\n' +
      'NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key'
  )
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// 타입스크립트 타입 내보내기 (필요에 따라 확장)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          first_name: string | null
          last_name: string | null
          created_at: string
          clicker_score: number
          betting_score: number
          total_score: number
          daily_bets: number
          last_bet_reset: string | null
        }
        Insert: {
          id: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          clicker_score?: number
          betting_score?: number
          total_score?: number
          daily_bets?: number
          last_bet_reset?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          clicker_score?: number
          betting_score?: number
          total_score?: number
          daily_bets?: number
          last_bet_reset?: string | null
        }
      }
      // 필요한 다른 테이블 정의를 추가할 수 있습니다
    }
  }
}

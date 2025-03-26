export type TaskType = 'DAILY' | 'SOCIAL' | 'ONE_TIME'
export type BetType = 'UP' | 'DOWN'
export type BetResult = 'WIN' | 'LOSE' | 'PENDING'

export interface User {
  id: string
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  created_at: Date
  clicker_score: number
  betting_score: number
  total_score: number
  last_click_time: Date
  daily_bets: number
  last_bet_reset: Date
  referral_code: string
  referrer_id?: string | null
  referrals?: ReferralUser[]
}

export interface ReferralUser {
  id: string
  username: string
  created_at: Date
  points_earned?: number
}

export interface Bet {
  id: string
  user_id: string
  amount: number
  type: BetType
  created_at: Date
  result?: BetResult | null
  score_earned: number
  sol_price_start: number
  sol_price_end?: number | null
}

export interface Task {
  id: string
  name: string
  description: string
  reward: number
  type: TaskType
  task_key: string
}

export interface UserTask {
  id: string
  user_id: string
  task_id: string
  completed: boolean
  completed_at?: Date | null
  task?: Task
}

export interface SolCandle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface LeaderboardEntry {
  id: string
  username: string
  total_score: number
  rank: number
}

import { create } from 'zustand'
import { Bet, BetType, SolCandle } from '@/types'
import { supabase } from '@/lib/supabase'
import { useUserStore } from './userStore'

interface BettingState {
  bets: Bet[]
  currentBet: Bet | null
  isLoading: boolean
  error: string | null
  candleData: SolCandle[]
  currentPrice: number
  countdown: number | null

  setBets: (bets: Bet[]) => void
  addBet: (bet: Bet) => void
  setCurrentBet: (bet: Bet | null) => void
  setCandleData: (data: SolCandle[]) => void
  setCurrentPrice: (price: number) => void
  setCountdown: (seconds: number | null) => void
  placeBet: (type: BetType) => Promise<void>
  fetchBettingHistory: (userId: string) => Promise<void>
  updateBetResult: (betId: string, solPriceEnd: number, result: 'WIN' | 'LOSE', scoreEarned: number) => Promise<void>
  resetError: () => void
}

export const useBettingStore = create<BettingState>((set, get) => ({
  bets: [],
  currentBet: null,
  isLoading: false,
  error: null,
  candleData: [],
  currentPrice: 0,
  countdown: null,

  setBets: (bets) => set({ bets }),

  addBet: (bet) =>
    set((state) => ({
      bets: [bet, ...state.bets].slice(0, 20) // Keep only last 20 bets
    })),

  setCurrentBet: (bet) => set({ currentBet: bet }),

  setCandleData: (data) => set({ candleData: data }),

  setCurrentPrice: (price) => set({ currentPrice: price }),

  setCountdown: (seconds) => set({ countdown: seconds }),

  // Supabase를 이용하여 배팅 기록 가져오기
  fetchBettingHistory: async (userId) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        throw error
      }

      set({ bets: data as Bet[], isLoading: false })
    } catch (err) {
      console.error('Error fetching betting history:', err)
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch betting history',
        isLoading: false
      })
    }
  },

  // Supabase를 이용하여 배팅 결과 업데이트
  updateBetResult: async (betId, solPriceEnd, result, scoreEarned) => {
    set({ isLoading: true, error: null })

    try {
      // 배팅 결과 업데이트
      const { data, error } = await supabase
        .from('bets')
        .update({
          sol_price_end: solPriceEnd,
          result: result,
          score_earned: scoreEarned
        })
        .eq('id', betId)
        .select()
        .single()

      if (error) {
        throw error
      }

      // 유저 점수 업데이트
      if (scoreEarned > 0) {
        const user = useUserStore.getState().user
        if (user) {
          useUserStore.getState().updateBettingScore(scoreEarned)
        }
      }

      // 현재 진행 중인 배팅 종료
      set({ currentBet: null, isLoading: false })

      // 배팅 목록 업데이트
      set((state) => ({
        bets: state.bets.map((bet) => (bet.id === betId ? (data as Bet) : bet))
      }))
    } catch (err) {
      console.error('Error updating bet result:', err)
      set({
        error: err instanceof Error ? err.message : 'Failed to update bet result',
        isLoading: false
      })
    }
  },

  placeBet: async (type) => {
    set({ isLoading: true, error: null })

    try {
      const user = useUserStore.getState().user

      if (!user) {
        throw new Error('User not logged in')
      }

      // 일일 베팅 제한 확인
      if (user.daily_bets >= 10) {
        throw new Error('Daily betting limit reached')
      }

      // 24시간 리셋 확인
      const now = new Date()
      const lastReset = new Date(user.last_bet_reset)
      const oneDayInMs = 24 * 60 * 60 * 1000

      if (now.getTime() - lastReset.getTime() > oneDayInMs) {
        useUserStore.getState().resetDailyBets()
      }

      // 배팅 생성
      const { data, error } = await supabase
        .from('bets')
        .insert([
          {
            user_id: user.id,
            type: type,
            amount: 10, // 고정 금액
            sol_price_start: get().currentPrice,
            result: 'PENDING'
          }
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      // 일일 베팅 카운트 증가
      useUserStore.getState().incrementDailyBets()

      const newBet = data as Bet
      set({ currentBet: newBet, isLoading: false })

      // 배팅 목록에 추가
      get().addBet(newBet)

      // 카운트다운 시작 (5초 후 결과 확인)
      set({ countdown: 5 })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to place bet',
        isLoading: false
      })
    }
  },

  resetError: () => set({ error: null })
}))

import { create } from 'zustand'
import { Bet, BetType, SolCandle } from '@/types'

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
  placeBet: (type: BetType) => void
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
      bets: [bet, ...state.bets].slice(0, 20) // Keep only last
      // 20 bets
    })),

  setCurrentBet: (bet) => set({ currentBet: bet }),

  setCandleData: (data) => set({ candleData: data }),

  setCurrentPrice: (price) => set({ currentPrice: price }),

  setCountdown: (seconds) => set({ countdown: seconds }),

  placeBet: async (type) => {
    set({ isLoading: true, error: null })

    try {
      // 실제 구현에서는 API를 호출하여 서버에 베팅 정보를 저장해야 합니다.
      // 여기서는 로컬 state 업데이트만 수행합니다.
      const newBet: Bet = {
        id: `temp-${Date.now()}`,
        user_id: 'temp-user', // 실제 유저 ID로 대체해야 합니다
        amount: 10,
        type,
        created_at: new Date(),
        result: 'PENDING',
        score_earned: 0,
        sol_price_start: get().currentPrice
      }

      set({ currentBet: newBet, isLoading: false })

      // 카운트다운 시작
      set({ countdown: 5 })

      // 실제 구현에서는 여기에 서버로 베팅 정보를 전송하는 코드를 추가합니다.
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to place bet',
        isLoading: false
      })
    }
  },

  resetError: () => set({ error: null })
}))

import { create } from 'zustand'
import { User } from '@/types'
import { persist } from 'zustand/middleware'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  boost: number
  lastBoostRefresh: string | null

  setUser: (user: User) => void
  updateClickerScore: (increment: number) => void
  updateBettingScore: (increment: number) => void
  resetDailyBets: () => void
  incrementDailyBets: () => void
  resetUser: () => void
  useBoost: (amount: number) => void
  refreshBoost: () => void
  getRank: () => string
}

export const MAX_BOOST = 500

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      boost: MAX_BOOST,
      lastBoostRefresh: null,

      setUser: (user) => set({ user }),

      updateClickerScore: (increment) =>
        set((state) => {
          if (!state.user) return state

          const newClickerScore = state.user.clicker_score + increment
          const newTotalScore = state.user.betting_score + newClickerScore

          return {
            user: {
              ...state.user,
              clicker_score: newClickerScore,
              total_score: newTotalScore,
              last_click_time: new Date()
            }
          }
        }),

      updateBettingScore: (increment) =>
        set((state) => {
          if (!state.user) return state

          const newBettingScore = state.user.betting_score + increment
          const newTotalScore = state.user.clicker_score + newBettingScore

          return {
            user: {
              ...state.user,
              betting_score: newBettingScore,
              total_score: newTotalScore
            }
          }
        }),

      resetDailyBets: () =>
        set((state) => {
          if (!state.user) return state

          return {
            user: {
              ...state.user,
              daily_bets: 0,
              last_bet_reset: new Date()
            }
          }
        }),

      incrementDailyBets: () =>
        set((state) => {
          if (!state.user) return state

          return {
            user: {
              ...state.user,
              daily_bets: state.user.daily_bets + 1
            }
          }
        }),

      useBoost: (amount) =>
        set((state) => {
          if (state.boost <= 0) return state

          const newBoost = Math.max(0, state.boost - amount)
          return { boost: newBoost }
        }),

      refreshBoost: () =>
        set(() => {
          // 24시간마다 boost 리셋
          const now = new Date()
          const lastRefresh = get().lastBoostRefresh

          if (!lastRefresh) {
            return { boost: MAX_BOOST, lastBoostRefresh: now.toISOString() }
          }

          // ISO 문자열을 Date 객체로 변환하여 비교
          const lastRefreshDate = new Date(lastRefresh)
          if (now.getTime() - lastRefreshDate.getTime() >= 24 * 60 * 60 * 1000) {
            return { boost: MAX_BOOST, lastBoostRefresh: now.toISOString() }
          }

          return {}
        }),

      getRank: () => {
        const totalScore = get().user?.total_score || 0

        if (totalScore >= 5000) return 'diamond'
        if (totalScore >= 4000) return 'platinum'
        if (totalScore >= 3000) return 'gold'
        if (totalScore >= 2000) return 'silver'
        if (totalScore >= 1000) return 'bronze'
        return 'unranked'
      },

      resetUser: () => set({ user: null, error: null })
    }),
    {
      name: 'user-storage'
    }
  )
)

import { create } from 'zustand'
import { User } from '@/types'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

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
  initUser: () => void
  fetchUser: (userId: string) => Promise<void>
  createUser: (userData: Partial<User>) => Promise<User | null>
  saveUserToSupabase: () => Promise<void>
}

export const MAX_BOOST = 500

// 초기 사용자 상태
const defaultUser: User = {
  id: 'local-user',
  username: 'Player',
  first_name: null,
  last_name: null,
  created_at: new Date(),
  clicker_score: 0,
  betting_score: 0,
  total_score: 0,
  daily_bets: 0,
  last_bet_reset: new Date(),
  last_click_time: new Date(),
  referral_code: 'LOCAL' + Math.random().toString(36).substring(2, 10)
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      boost: MAX_BOOST,
      lastBoostRefresh: null,

      setUser: (user) => set({ user }),

      // 기본 사용자 상태 초기화
      initUser: () => {
        if (!get().user) {
          set({ user: defaultUser })
        }
      },

      // Supabase에서 사용자 정보 가져오기
      fetchUser: async (userId) => {
        set({ isLoading: true, error: null })

        try {
          const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()

          if (error) {
            throw error
          }

          if (data) {
            set({ user: data as User, isLoading: false })
          } else {
            set({ error: 'User not found', isLoading: false })
          }
        } catch (err) {
          console.error('Error fetching user:', err)
          set({
            error: err instanceof Error ? err.message : 'Failed to fetch user',
            isLoading: false
          })
        }
      },

      // 새 사용자 생성
      createUser: async (userData) => {
        set({ isLoading: true, error: null })

        try {
          // 랜덤 추천인 코드 생성
          const generateReferralCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let result = ''
            for (let i = 0; i < 8; i++) {
              result += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            return result
          }

          const newUser = {
            ...userData,
            clicker_score: 0,
            betting_score: 0,
            total_score: 0,
            daily_bets: 0,
            last_bet_reset: new Date(),
            last_click_time: new Date(),
            referral_code: generateReferralCode(),
            created_at: new Date()
          }

          const { data, error } = await supabase.from('users').insert([newUser]).select().single()

          if (error) {
            throw error
          }

          set({ user: data as User, isLoading: false })
          return data as User
        } catch (err) {
          console.error('Error creating user:', err)
          set({
            error: err instanceof Error ? err.message : 'Failed to create user',
            isLoading: false
          })
          return null
        }
      },

      // Supabase에 사용자 정보 저장
      saveUserToSupabase: async () => {
        const user = get().user

        if (!user || user.id === 'local-user') {
          return
        }

        try {
          const { error } = await supabase
            .from('users')
            .update({
              clicker_score: user.clicker_score,
              betting_score: user.betting_score,
              total_score: user.total_score,
              daily_bets: user.daily_bets,
              last_bet_reset: user.last_bet_reset,
              last_click_time: user.last_click_time
            })
            .eq('id', user.id)

          if (error) {
            console.error('Error updating user in Supabase:', error)
          }
        } catch (err) {
          console.error('Error saving user to Supabase:', err)
        }
      },

      updateClickerScore: (increment) =>
        set((state) => {
          if (!state.user) {
            console.log('No user found. Creating default user...')
            const newUser = {
              ...defaultUser,
              clicker_score: increment,
              total_score: increment // 초기 유저는 betting_score가 0이므로 clicker_score가 total_score
            }
            return { user: newUser }
          }

          console.log('Current clicker score:', state.user.clicker_score)
          console.log('Incrementing by:', increment)

          const newClickerScore = (state.user.clicker_score || 0) + increment

          // 총 점수는 베팅 점수와 클리커 점수의 합
          const betting = state.user.betting_score || 0
          const newTotalScore = betting + newClickerScore

          console.log('New clicker score:', newClickerScore)
          console.log('Betting score:', betting)
          console.log('New total score:', newTotalScore)

          const updatedUser = {
            ...state.user,
            clicker_score: newClickerScore,
            total_score: newTotalScore,
            last_click_time: new Date()
          }

          // 비동기적으로 Supabase에 업데이트
          get().saveUserToSupabase()

          return { user: updatedUser }
        }),

      updateBettingScore: (increment) =>
        set((state) => {
          if (!state.user) return state

          const newBettingScore = (state.user.betting_score || 0) + increment
          const newTotalScore = (state.user.clicker_score || 0) + newBettingScore

          const updatedUser = {
            ...state.user,
            betting_score: newBettingScore,
            total_score: newTotalScore
          }

          // 비동기적으로 Supabase에 업데이트
          get().saveUserToSupabase()

          return { user: updatedUser }
        }),

      resetDailyBets: () =>
        set((state) => {
          if (!state.user) return state

          const updatedUser = {
            ...state.user,
            daily_bets: 0,
            last_bet_reset: new Date()
          }

          // 비동기적으로 Supabase에 업데이트
          get().saveUserToSupabase()

          return { user: updatedUser }
        }),

      incrementDailyBets: () =>
        set((state) => {
          if (!state.user) return state

          const updatedUser = {
            ...state.user,
            daily_bets: (state.user.daily_bets || 0) + 1
          }

          // 비동기적으로 Supabase에 업데이트
          get().saveUserToSupabase()

          return { user: updatedUser }
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

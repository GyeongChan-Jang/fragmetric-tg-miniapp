import { create } from 'zustand'
import { LeaderboardEntry } from '@/types'

interface LeaderboardState {
  entries: LeaderboardEntry[]
  isLoading: boolean
  error: string | null
  userRank: number | null

  setEntries: (entries: LeaderboardEntry[]) => void
  setUserRank: (rank: number) => void
  fetchLeaderboard: () => Promise<void>
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,
  userRank: null,

  setEntries: (entries) => set({ entries }),

  setUserRank: (rank) => set({ userRank: rank }),

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null })

    try {
      // 실제 구현에서는 API를 호출하여 서버에서 리더보드 데이터를 가져옵니다.
      // 여기서는 예시 데이터를 사용합니다.
      const mockData: LeaderboardEntry[] = [
        { id: '1', username: 'user1', total_score: 1200, rank: 1 },
        { id: '2', username: 'user2', total_score: 900, rank: 2 },
        { id: '3', username: 'user3', total_score: 800, rank: 3 },
        { id: '4', username: 'user4', total_score: 700, rank: 4 },
        { id: '5', username: 'user5', total_score: 600, rank: 5 }
      ]

      // 잠시 지연시켜 로딩 상태 확인
      await new Promise((resolve) => setTimeout(resolve, 500))

      set({ entries: mockData, isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch leaderboard',
        isLoading: false
      })
    }
  }
}))

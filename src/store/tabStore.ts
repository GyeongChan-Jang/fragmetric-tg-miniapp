import { create } from 'zustand'

export type TabName = 'clicker' | 'betting' | 'leaderboard' | 'account'
export type AccountSubTab = 'tasks' | 'referral'

interface TabState {
  activeTab: TabName
  activeAccountSubTab: AccountSubTab
  setActiveTab: (tab: TabName) => void
  setActiveAccountSubTab: (subTab: AccountSubTab) => void
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'clicker', // 기본 탭은 Clicker로 설정
  activeAccountSubTab: 'tasks', // 기본 Account 서브탭은 Tasks로 설정

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveAccountSubTab: (subTab) => set({ activeAccountSubTab: subTab })
}))

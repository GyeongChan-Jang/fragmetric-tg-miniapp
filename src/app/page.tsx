'use client'

import { useEffect } from 'react'
import { useTabStore } from '@/store/tabStore'
import { useUserStore } from '@/store/userStore'
import { useTelegramAuth } from '@/hooks/useTelegramAuth'
import MainContainer from '@/components/MainContainer'
import ClickerGame from '@/components/Clicker/ClickerGame'
import { SolBetting } from '@/components/Betting/SolBetting'
import Leaderboard from '@/components/Leaderboard/Leaderboard'
import Account from '@/components/Account/Account'

export default function Home() {
  const { activeTab } = useTabStore()
  const { user, isLoading: userLoading, error: userError } = useUserStore()
  const { isLoading: authLoading, error: authError, initTelegramAuth } = useTelegramAuth()

  // 사용자 인증 처리
  useEffect(() => {
    initTelegramAuth()
  }, [initTelegramAuth])

  const isLoading = userLoading || authLoading
  const error = userError || authError

  // 활성화된 탭에 따라 내용 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case 'clicker':
        return <ClickerGame />
      case 'betting':
        return <SolBetting />
      case 'leaderboard':
        return <Leaderboard />
      case 'account':
        return <Account />
      default:
        return <ClickerGame />
    }
  }

  return (
    <MainContainer>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      ) : (
        renderContent()
      )}
    </MainContainer>
  )
}

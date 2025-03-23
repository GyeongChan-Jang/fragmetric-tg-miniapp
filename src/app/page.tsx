'use client'

import { useEffect } from 'react'
import { useTabStore } from '@/store/tabStore'
import { useUserStore } from '@/store/userStore'
import MainContainer from '@/components/MainContainer'
import ClickerGame from '@/components/Clicker/ClickerGame'
import { SolBetting } from '@/components/Betting/SolBetting'
import Leaderboard from '@/components/Leaderboard/Leaderboard'
import Account from '@/components/Account/Account'

export default function Home() {
  const { activeTab } = useTabStore()
  const { user, isLoading, error, setUser } = useUserStore()

  // 사용자 데이터 로딩
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/user')

        if (!response.ok) {
          // 사용자가 없는 경우 새로 생성
          if (response.status === 404) {
            const createResponse = await fetch('/api/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            })

            if (createResponse.ok) {
              const userData = await createResponse.json()
              setUser(userData)
            } else {
              throw new Error('Failed to create user')
            }
          } else {
            throw new Error('Failed to fetch user data')
          }
        } else {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [])

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

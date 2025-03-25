import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { User } from '@/types'
import { supabase } from '@/lib/supabase'

export interface TelegramAuthHook {
  isLoading: boolean
  error: string | null
  user: User | null
  isAuthenticated: boolean
  initTelegramAuth: () => Promise<void>
}

/**
 * Telegram 인증을 처리하는 훅
 *
 * Telegram WebApp API로부터 사용자 정보를 받아 Supabase Edge Function을 통해 검증합니다.
 * 검증이 성공하면 사용자 정보를 저장하고, 실패하면 로컬 사용자를 초기화합니다.
 */
export function useTelegramAuth(): TelegramAuthHook {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, setUser, initUser } = useUserStore()

  /**
   * Telegram WebApp 초기화 함수
   */
  const initTelegramApp = () => {
    // Telegram WebApp API가 있는지 확인
    if (window.Telegram?.WebApp) {
      // 앱 준비 완료 알림
      window.Telegram.WebApp.ready()
      console.log('Telegram WebApp API is ready')

      // Viewport 조정
      window.Telegram.WebApp.expand()
    }
  }

  /**
   * 사용자 인증 초기화 함수
   */
  const initTelegramAuth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Telegram WebApp API가 있는지 확인
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp
        const initData = webApp.initData

        if (!initData) {
          throw new Error('No Telegram init data available')
        }

        console.log('Verifying Telegram user...')

        // Supabase Edge Function을 통해 검증
        const { data, error } = await supabase.functions.invoke('verify-telegram', {
          body: { initData }
        })

        if (error) {
          throw new Error(error.message || 'Telegram authentication failed')
        }

        if (!data.valid) {
          throw new Error('Invalid Telegram data')
        }

        // 사용자 정보 저장
        const telegramUser = data.user as User
        setUser(telegramUser)
        setIsAuthenticated(true)

        // 로컬 스토리지에 사용자 ID 저장
        localStorage.setItem('user-id', telegramUser.id)

        console.log('Telegram 인증 성공:', telegramUser)
      } else {
        // Telegram WebApp API가 없는 경우 로컬 데이터 사용
        console.log('Telegram WebApp API not available, using local data')

        // 로컬 스토리지에서 사용자 ID 확인
        const storedUserId = localStorage.getItem('user-id')

        if (storedUserId && storedUserId !== 'local-user') {
          // 기존 사용자 정보 가져오기
          const { data, error } = await supabase.from('users').select('*').eq('id', storedUserId).single()

          if (error) {
            throw error
          }

          if (data) {
            setUser(data as User)
            setIsAuthenticated(true)
          } else {
            initUser()
          }
        } else {
          // 로컬 사용자 초기화
          initUser()
        }
      }
    } catch (err) {
      console.error('Telegram 인증 오류:', err)
      setError(err instanceof Error ? err.message : '인증에 실패했습니다')

      // 오류 발생 시 로컬 사용자 초기화
      initUser()
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 Telegram WebApp 초기화
  useEffect(() => {
    initTelegramApp()
  }, [])

  return {
    isLoading,
    error,
    user,
    isAuthenticated,
    initTelegramAuth
  }
}

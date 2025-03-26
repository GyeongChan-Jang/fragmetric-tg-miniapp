import { useState, useEffect, useCallback } from 'react'
import { useUserStore } from '@/store/userStore'
import { User } from '@/types'
import { supabase } from '@/lib/supabase'
import { initData, useSignal } from '@telegram-apps/sdk-react'

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
 * @telegram-apps/sdk-react의 initData를 사용하여 사용자 정보를 가져오고
 * Supabase에 저장합니다.
 */
export function useTelegramAuth(): TelegramAuthHook {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, setUser, initUser } = useUserStore()
  const [hasInitialized, setHasInitialized] = useState(false)

  // @telegram-apps/sdk-react에서 사용자 정보 가져오기
  const initDataUser = useSignal(initData.user)
  const initDataState = useSignal(initData.state)

  /**
   * 사용자 인증 초기화 함수
   */
  const initTelegramAuth = useCallback(async () => {
    // 이미 로딩 중이거나 초기화가 완료된 경우 중복 실행 방지
    if (isLoading || hasInitialized) return

    setIsLoading(true)
    setError(null)

    try {
      // SDK에서 제공하는 사용자 정보가 있는지 확인
      if (initDataUser && initDataState) {
        console.log('Telegram user found from SDK:', initDataUser)

        // Supabase Edge Function 호출하여 사용자 등록/업데이트
        const { data, error } = await supabase.functions.invoke('verify-telegram', {
          body: { user: initDataUser }
        })

        if (error) {
          throw new Error(error.message || 'Telegram authentication failed')
        }

        if (!data.success) {
          throw new Error('User verification failed')
        }

        // 사용자 정보 저장
        const telegramUser = data.user as User
        setUser(telegramUser)
        setIsAuthenticated(true)

        // 로컬 스토리지에 사용자 ID 저장
        localStorage.setItem('user-id', telegramUser.id)

        console.log('사용자 등록/업데이트 완료:', telegramUser)
      } else {
        // SDK에서 사용자 정보를 가져올 수 없는 경우
        console.log('No Telegram user data from SDK, checking localStorage')

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

      // 초기화 완료 표시
      setHasInitialized(true)
    } catch (err) {
      console.error('Telegram 인증 오류:', err)
      setError(err instanceof Error ? err.message : '인증에 실패했습니다')

      // 오류 발생 시 로컬 사용자 초기화
      initUser()
    } finally {
      setIsLoading(false)
    }
  }, [initDataUser, initDataState, setUser, initUser, isLoading, hasInitialized])

  return {
    isLoading,
    error,
    user,
    isAuthenticated,
    initTelegramAuth
  }
}

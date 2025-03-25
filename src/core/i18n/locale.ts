// 정적 내보내기를 위해 서버 액션 대신 클라이언트 측 쿠키 처리 사용
'use client'

import { defaultLocale } from './config'
import type { Locale } from './types'

// 쿠키 이름 상수
const COOKIE_NAME = 'NEXT_LOCALE'

// 클라이언트 측에서 쿠키를 가져오는 함수
const getLocale = () => {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  // 쿠키에서 로케일 값 찾기
  const cookies = document.cookie.split(';')
  const localeCookie = cookies.find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`))

  return localeCookie ? localeCookie.split('=')[1] : defaultLocale
}

// 클라이언트 측에서 쿠키를 설정하는 함수
const setLocale = (locale?: string) => {
  if (typeof window === 'undefined') {
    return
  }

  // 쿠키 설정 (30일 유효)
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + 30)

  document.cookie = `${COOKIE_NAME}=${locale || defaultLocale}; expires=${expireDate.toUTCString()}; path=/`
}

export { getLocale, setLocale }

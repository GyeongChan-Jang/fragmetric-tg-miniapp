'use client'

import { type PropsWithChildren, useEffect } from 'react'
import { initData, miniApp, useLaunchParams, useSignal } from '@telegram-apps/sdk-react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { AppRoot } from '@telegram-apps/telegram-ui'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorPage } from '@/components/ErrorPage'
import { useTelegramMock } from '@/hooks/useTelegramMock'
import { useDidMount } from '@/hooks/useDidMount'
import { useClientOnce } from '@/hooks/useClientOnce'
import { setLocale } from '@/core/i18n/locale'
import { init } from '@/core/init'

import './styles.css'

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === 'development'

  // Mock Telegram environment if needed (both in development and production)
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock()
  } catch (error) {
    console.warn('Failed to mock Telegram environment:', error)
  }

  // Attempt to get launch parameters with error handling
  let lp
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    lp = useLaunchParams()
  } catch (error) {
    console.warn('Failed to retrieve launch parameters:', error)
    lp = {
      startParam: isDev ? 'debug' : undefined,
      platform: 'unknown'
    }
  }

  const debug = isDev || lp.startParam === 'debug'

  // Initialize the library.
  useClientOnce(() => {
    init(debug)
  })

  const isDark = useSignal(miniApp.isDark)
  const initDataUser = useSignal(initData.user)

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.languageCode)
  }, [initDataUser])

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  )
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount()

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">Loading</div>
  )
}

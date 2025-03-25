import { useClientOnce } from '@/hooks/useClientOnce'
import {
  isTMA,
  type LaunchParams,
  mockTelegramEnv,
  parseInitData,
  retrieveLaunchParams
} from '@telegram-apps/sdk-react'

/**
 * Mocks Telegram environment when not in Telegram environment.
 * Works in both development and production modes.
 */
export function useTelegramMock(): void {
  useClientOnce(() => {
    // If we're already in a Telegram environment or we've already mocked it, exit
    if (sessionStorage.getItem('env-mocked') && isTMA('simple')) {
      return
    }

    // Determine which launch params should be applied. We could already
    // apply them previously, or they may be specified on purpose using the
    // default launch parameters transmission method.
    let lp: LaunchParams | undefined
    try {
      lp = retrieveLaunchParams()
      // If we got valid launch params, we're in a Telegram environment
      if (lp && lp.platform) {
        return
      }
    } catch (e) {
      // If we're here, we're not in a Telegram environment, so let's mock it
      const initDataRaw = new URLSearchParams([
        [
          'user',
          JSON.stringify({
            id: 99281932,
            first_name: 'Andrew',
            last_name: 'Rogue',
            username: 'rogue',
            language_code: 'en',
            is_premium: true,
            allows_write_to_pm: true
          })
        ],
        ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
        ['auth_date', '1716922846'],
        ['start_param', 'debug'],
        ['chat_type', 'sender'],
        ['chat_instance', '8428209589180549439'],
        ['signature', '6fbdaab833d39f54518bd5c3eb3f511d035e68cb']
      ]).toString()

      lp = {
        themeParams: {
          accentTextColor: '#6ab2f2',
          bgColor: '#17212b',
          buttonColor: '#5288c1',
          buttonTextColor: '#ffffff',
          destructiveTextColor: '#ec3942',
          headerBgColor: '#17212b',
          hintColor: '#708499',
          linkColor: '#6ab3f3',
          secondaryBgColor: '#232e3c',
          sectionBgColor: '#17212b',
          sectionHeaderTextColor: '#6ab3f3',
          subtitleTextColor: '#708499',
          textColor: '#f5f5f5'
        },
        initData: parseInitData(initDataRaw),
        initDataRaw,
        version: '8',
        platform: 'tdesktop'
      }
    }

    sessionStorage.setItem('env-mocked', '1')
    mockTelegramEnv(lp)

    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) {
      console.warn(
        '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.'
      )
    } else {
      console.log('Telegram environment has been mocked for outside-Telegram usage.')
    }
  })
}

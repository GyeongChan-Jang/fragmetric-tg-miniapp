declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          query_id?: string
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
          }
          auth_date?: number
          hash?: string
          start_param?: string
        }
        version: string
        platform: string
        colorScheme: 'light' | 'dark'
        themeParams: {
          bg_color: string
          text_color: string
          hint_color: string
          link_color: string
          button_color: string
          button_text_color: string
        }
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        isClosingConfirmationEnabled: boolean

        ready(): void
        expand(): void
        close(): void
        showConfirm(message: string): Promise<boolean>
        showAlert(message: string): Promise<void>
        showPopup(params: {
          title?: string
          message: string
          buttons?: {
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
            text: string
            id?: string
          }[]
        }): Promise<string>
        enableClosingConfirmation(): void
        disableClosingConfirmation(): void
        onEvent(eventType: string, eventHandler: Function): void
        offEvent(eventType: string, eventHandler: Function): void
        setHeaderColor(color: 'bg_color' | 'secondary_bg_color' | string): void
        setBackgroundColor(color: 'bg_color' | 'secondary_bg_color' | string): void
        openLink(url: string): void
        openTelegramLink(url: string): void
        openInvoice(url: string): Promise<{ status: 'paid' | 'cancelled' | 'failed'; error?: string }>
        setBackButton(params: { is_visible: boolean }): void
        setMainButton(params: {
          text?: string
          color?: string
          text_color?: string
          is_active?: boolean
          is_visible?: boolean
        }): void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText(text: string): void
          onClick(callback: Function): void
          offClick(callback: Function): void
          show(): void
          hide(): void
          enable(): void
          disable(): void
          showProgress(leaveActive?: boolean): void
          hideProgress(): void
        }
        BackButton: {
          isVisible: boolean
          onClick(callback: Function): void
          offClick(callback: Function): void
          show(): void
          hide(): void
        }
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
          notificationOccurred(type: 'error' | 'success' | 'warning'): void
          selectionChanged(): void
        }
        isVersionAtLeast(version: string): boolean
      }
    }
  }
}

export {}

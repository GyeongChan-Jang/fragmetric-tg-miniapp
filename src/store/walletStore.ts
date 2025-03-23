import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useTonConnectUI, TonConnectUI } from '@tonconnect/ui-react'

interface WalletState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  tonBalance: number
  address: string | null

  setIsConnected: (status: boolean) => void
  setIsConnecting: (status: boolean) => void
  setError: (error: string | null) => void
  setTonBalance: (balance: number) => void
  setAddress: (address: string | null) => void
  reset: () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      isConnecting: false,
      error: null,
      tonBalance: 0,
      address: null,

      setIsConnected: (status) => set({ isConnected: status }),
      setIsConnecting: (status) => set({ isConnecting: status }),
      setError: (error) => set({ error }),
      setTonBalance: (balance) => set({ tonBalance: balance }),
      setAddress: (address) => set({ address }),
      reset: () =>
        set({
          isConnected: false,
          isConnecting: false,
          error: null,
          tonBalance: 0,
          address: null
        })
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        // 저장할 상태만 선택 (연결 상태는 저장하지 않음)
        isConnected: false,
        tonBalance: state.tonBalance
      })
    }
  )
)

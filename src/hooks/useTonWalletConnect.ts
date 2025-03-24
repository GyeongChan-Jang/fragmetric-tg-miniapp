import { useEffect } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useWalletStore } from '@/store/walletStore'

export const useTonWalletConnect = () => {
  const [tonConnectUI] = useTonConnectUI()
  const { setIsConnected, setIsConnecting, setTonBalance, setError, setAddress, reset, isConnected } = useWalletStore()

  // 지갑 연결 상태 변화 감지
  useEffect(() => {
    // TON 잔액 조회 함수를 useEffect 내부로 이동
    const fetchTonBalance = async (address: string) => {
      try {
        // 현재는 임시로 랜덤 값 설정 (실제 구현에서는 TON API 호출)
        const mockBalance = Math.random() * 10
        setTonBalance(mockBalance)
      } catch (error) {
        console.error('Error fetching TON balance:', error)
      }
    }

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        // 지갑 연결됨
        setIsConnected(true)
        setAddress(wallet.account.address)
        setError(null)

        // 잔액 업데이트 (선택사항)
        fetchTonBalance(wallet.account.address)
      } else {
        // 지갑 연결 해제됨
        reset()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [tonConnectUI, setIsConnected, setAddress, setError, reset, setTonBalance])

  // 지갑 연결 함수
  const connectWallet = () => {
    setIsConnecting(true)

    try {
      tonConnectUI.openModal()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('지갑 연결 중 오류가 발생했습니다.')
      }
      setIsConnecting(false)
    }
  }

  // 지갑 연결 해제 함수
  const disconnectWallet = () => {
    tonConnectUI.disconnect()
  }

  return {
    connectWallet,
    disconnectWallet,
    connected: isConnected,
    isWalletModalOpen: !!tonConnectUI.modalState,
    closeModal: tonConnectUI.closeModal
  }
}

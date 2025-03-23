import { useEffect } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useWalletStore } from '@/store/walletStore'

export const useTonWalletConnect = () => {
  const [tonConnectUI] = useTonConnectUI()
  const { setIsConnected, setIsConnecting, setTonBalance, setError, setAddress, reset } = useWalletStore()

  // 지갑 연결 상태 변화 감지
  useEffect(() => {
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
  }, [tonConnectUI])

  // TON 잔액 조회 함수 (예시)
  const fetchTonBalance = async (address: string) => {
    try {
      // 여기에 실제 TON 잔액 조회 로직 구현
      // API 예시: const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);

      // 현재는 임시로 랜덤 값 설정
      const mockBalance = Math.random() * 10
      setTonBalance(mockBalance)
    } catch (error) {
      console.error('Error fetching TON balance:', error)
    }
  }

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
    isWalletModalOpen: !!tonConnectUI.modalState,
    closeModal: tonConnectUI.closeModal
  }
}

import { useTonWalletConnect } from '@/hooks/useTonWalletConnect'
import { useWalletStore } from '@/store/walletStore'
import { TonConnectButton } from '@tonconnect/ui-react'
import { FiExternalLink, FiCheckCircle } from 'react-icons/fi'
import { FC } from 'react'

interface TonWalletButtonProps {
  customStyle?: boolean
}

const TonWalletButton: FC<TonWalletButtonProps> = ({ customStyle = true }) => {
  const { isConnected, address, tonBalance, error } = useWalletStore()
  const { connectWallet, disconnectWallet } = useTonWalletConnect()

  // 지갑 주소 축약 표시
  const shortenAddress = (address: string | null) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Default TonConnectButton 사용 (TON Connect 스타일)
  if (!customStyle) {
    return <TonConnectButton />
  }

  // 커스텀 버튼 스타일
  return (
    <div>
      {error ? (
        <div className="flex items-center">
          <button
            onClick={() => window.open('https://wallet.ton.org', '_blank')}
            className="mr-2 py-2 px-3 bg-purple-500 text-white rounded-md text-sm flex items-center"
          >
            <FiExternalLink className="mr-1" /> TON Wallet
          </button>
          <button onClick={connectWallet} className="py-2 px-4 bg-blue-500 text-white rounded-md text-sm">
            Retry
          </button>
        </div>
      ) : isConnected && address ? (
        <button
          onClick={disconnectWallet}
          className="py-2 px-4 bg-green-500 text-white rounded-md text-sm flex items-center"
        >
          <FiCheckCircle className="mr-1" />
          {shortenAddress(address)} • {tonBalance.toFixed(2)} TON
        </button>
      ) : (
        <button onClick={connectWallet} className="py-2 px-4 bg-blue-500 text-white rounded-md text-sm">
          Connect TON Wallet
        </button>
      )}
    </div>
  )
}

export default TonWalletButton

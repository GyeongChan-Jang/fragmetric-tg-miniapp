import { useTonWalletConnect } from '@/hooks/useTonWalletConnect'
import { useWalletStore } from '@/store/walletStore'
import { TonConnectButton } from '@tonconnect/ui-react'
import { FiExternalLink, FiCheckCircle } from 'react-icons/fi'
import { FC } from 'react'
import Image from 'next/image'

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
    <div className="flex flex-col">
      <button
        onClick={isConnected ? disconnectWallet : connectWallet}
        className={`ton-wallet-button flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
          isConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-medium`}
      >
        <div className="flex items-center">
          <Image src="/images/ton-diamond.svg" width={24} height={24} alt="TON" className="mr-2" />
          {isConnected ? 'Disconnect Wallet' : 'Connect TON Wallet'}
        </div>
      </button>
      {isConnected && (
        <div className="mt-2 text-sm text-gray-700">
          <div className="flex items-center">
            <span className="font-medium mr-1">Address:</span>
            <span className="font-mono">{shortenAddress(address)}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-1">Balance:</span>
            <span>{tonBalance !== null ? `${tonBalance.toFixed(2)} TON` : 'Loading...'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TonWalletButton

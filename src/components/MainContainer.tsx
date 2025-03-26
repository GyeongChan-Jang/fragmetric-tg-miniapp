import { ReactNode } from 'react'
import TabBar from './TabBar/TabBar'
import { useTabStore } from '@/store/tabStore'
import { FiArrowLeft } from 'react-icons/fi'
import TonWalletButton from './TonWalletButton'

interface MainContainerProps {
  children: ReactNode
  title?: string
}

const MainContainer: React.FC<MainContainerProps> = ({ children, title }) => {
  const { activeTab } = useTabStore()

  // 탭에 따라 다른 제목 표시
  const getTitle = () => {
    if (title) return title

    switch (activeTab) {
      case 'clicker':
        return 'Clicker Game'
      case 'betting':
        return 'SOL Betting'
      case 'leaderboard':
        return 'Leaderboard'
      case 'account':
        return 'Account'
      default:
        return 'Fragmetric'
    }
  }

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-white">
      <header className="bg-white border-b border-gray-200 py-4 px-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-center">{getTitle()}</h1>
          <TonWalletButton customStyle={false} />
        </div>
      </header>

      <main className="flex-1 pt-16 pb-16 px-4 overflow-auto">{children}</main>

      <TabBar />
    </div>
  )
}

export default MainContainer

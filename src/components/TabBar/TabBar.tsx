import { useTabStore, TabName } from '@/store/tabStore'
import { motion } from 'framer-motion'
import { FaGamepad, FaChartLine, FaTrophy, FaUser } from 'react-icons/fa'

interface TabIconProps {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}

const TabIcon: React.FC<TabIconProps> = ({ active, icon, label, onClick }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center w-full py-2 ${active ? 'text-blue-500' : 'text-gray-500'}`}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {active && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </motion.div>
  )
}

const TabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useTabStore()

  const tabs: { id: TabName; icon: React.ReactNode; label: string }[] = [
    { id: 'clicker', icon: <FaGamepad size={20} />, label: 'Clicker' },
    { id: 'betting', icon: <FaChartLine size={20} />, label: 'Betting' },
    { id: 'leaderboard', icon: <FaTrophy size={20} />, label: 'Leaderboard' },
    { id: 'account', icon: <FaUser size={20} />, label: 'Account' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-14 z-50">
      {tabs.map((tab) => (
        <TabIcon
          key={tab.id}
          active={activeTab === tab.id}
          icon={tab.icon}
          label={tab.label}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </div>
  )
}

export default TabBar

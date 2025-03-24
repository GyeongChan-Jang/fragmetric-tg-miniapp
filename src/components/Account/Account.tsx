import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTabStore, AccountSubTab } from '@/store/tabStore'
import { useUserStore } from '@/store/userStore'
import { useTaskStore } from '@/store/taskStore'
import ReferralInfo from './ReferralInfo'
import TaskList from './TaskList'

export const Account: React.FC = () => {
  const { activeAccountSubTab, setActiveAccountSubTab } = useTabStore()
  const { user } = useUserStore()
  const { fetchTasks } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const SubTabButton: React.FC<{
    label: string
    subTab: AccountSubTab
  }> = ({ label, subTab }) => (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 ${
        activeAccountSubTab === subTab
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={() => setActiveAccountSubTab(subTab)}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col w-full bg-white text-gray-800 p-4 rounded-lg">
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-blue-500">
                {user?.username?.charAt(0)?.toUpperCase() || user?.first_name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.username || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Guest User'}
              </h2>
              <p className="text-sm text-gray-600">
                Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Clicker Score</p>
              <p className="text-xl font-bold text-blue-600">{user?.clicker_score || 0}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Betting Score</p>
              <p className="text-xl font-bold text-green-600">{user?.betting_score || 0}</p>
            </div>
          </div>

          <div className="mt-3 bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Score</p>
            <p className="text-xl font-bold text-purple-600">{user?.total_score || 0}</p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <SubTabButton label="Tasks" subTab="tasks" />
            <SubTabButton label="Referral" subTab="referral" />
          </div>
        </div>

        <motion.div
          key={activeAccountSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeAccountSubTab === 'tasks' ? <TaskList /> : <ReferralInfo />}
        </motion.div>
      </div>
    </div>
  )
}

export default Account

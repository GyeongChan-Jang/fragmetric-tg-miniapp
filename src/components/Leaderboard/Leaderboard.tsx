import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboardStore } from '@/store/leaderboardStore'
import { useUserStore } from '@/store/userStore'
import { LeaderboardEntry } from '@/types'

export const Leaderboard: React.FC = () => {
  const { entries, isLoading, error, userRank, fetchLeaderboard } = useLeaderboardStore()
  const { user } = useUserStore()
  const [filterType, setFilterType] = useState<'all' | 'clicker' | 'betting'>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const getTopEntries = (count: number) => {
    return entries.slice(0, count)
  }

  // 메달 컬러 설정
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400' // 금메달
      case 2:
        return 'bg-gray-300' // 은메달
      case 3:
        return 'bg-amber-600' // 동메달
      default:
        return 'bg-blue-100'
    }
  }

  // 리더보드 아이템 컴포넌트
  const LeaderboardItem: React.FC<{ entry: LeaderboardEntry; highlight?: boolean }> = ({
    entry,
    highlight = false
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center p-3 ${
          highlight ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-b border-gray-200'
        }`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3 text-white font-bold text-sm shadow-sm">
          {entry.rank <= 3 ? (
            <div className={`w-full h-full flex items-center justify-center rounded-full ${getMedalColor(entry.rank)}`}>
              {entry.rank}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
              {entry.rank}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-800">{entry.username}</div>
        </div>
        <div className="font-semibold text-lg text-gray-800">{entry.total_score}</div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col w-full bg-white text-gray-800 p-4 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center mb-2">Global Leaderboard</h2>
        <p className="text-gray-600 text-center text-sm">Compete with other players and earn rewards!</p>
      </div>

      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-md ${
              filterType === 'all'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('clicker')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300 ${
              filterType === 'clicker'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Clicker
          </button>
          <button
            onClick={() => setFilterType('betting')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300 rounded-r-md ${
              filterType === 'betting'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Betting
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-red-700">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="p-4 bg-blue-500 text-white font-semibold flex justify-between items-center">
            <span>Rank</span>
            <span>Score</span>
          </div>

          <AnimatePresence>
            {getTopEntries(10).map((entry) => (
              <LeaderboardItem key={entry.id} entry={entry} highlight={user ? entry.id === user.id : false} />
            ))}
          </AnimatePresence>

          {user && userRank && userRank > 10 && (
            <>
              <div className="py-2 text-center text-gray-500 border-b border-t border-gray-200">• • •</div>
              <LeaderboardItem
                entry={{
                  id: user.id,
                  username: user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                  total_score: user.total_score,
                  rank: userRank
                }}
                highlight
              />
            </>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-2 text-gray-800">How to earn points?</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Click Topu to earn Clicker points</li>
          <li>Win SOL betting games to earn Betting points</li>
          <li>Complete daily tasks for bonus points</li>
          <li>Invite friends using your referral code</li>
        </ul>
      </div>
    </div>
  )
}

export default Leaderboard

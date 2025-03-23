import { Bet } from '@/types'
import { motion } from 'framer-motion'

interface BettingHistoryProps {
  bets: Bet[]
}

const BettingHistory: React.FC<BettingHistoryProps> = ({ bets }) => {
  if (bets.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">No betting history yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-5 p-3 bg-gray-100 text-gray-700 font-medium text-sm border-b border-gray-200">
        <div>Time</div>
        <div>Type</div>
        <div>Start Price</div>
        <div>End Price</div>
        <div className="text-right">Result</div>
      </div>
      <div className="divide-y divide-gray-100">
        {bets.map((bet) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid grid-cols-5 p-3 text-sm ${
              bet.result === 'WIN' ? 'bg-green-50' : bet.result === 'LOSE' ? 'bg-red-50' : 'bg-yellow-50'
            }`}
          >
            <div className="text-gray-700">
              {new Date(bet.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className={bet.type === 'UP' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {bet.type}
            </div>
            <div className="text-gray-800">${bet.sol_price_start.toFixed(2)}</div>
            <div className="text-gray-800">{bet.sol_price_end ? `$${bet.sol_price_end.toFixed(2)}` : '-'}</div>
            <div className="text-right">
              {bet.result === 'WIN' && <span className="font-medium text-green-600">+{bet.score_earned}</span>}
              {bet.result === 'LOSE' && <span className="font-medium text-red-600">LOSE</span>}
              {bet.result === 'PENDING' && <span className="font-medium text-yellow-600">PENDING</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BettingHistory

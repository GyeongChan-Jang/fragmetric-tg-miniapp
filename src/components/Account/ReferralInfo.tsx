import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import { FiCopy, FiCheck, FiUsers } from 'react-icons/fi'

export const ReferralInfo: React.FC = () => {
  const { user } = useUserStore()
  const [copied, setCopied] = useState(false)

  const referralLink = user?.referral_code ? `https://fragmetric.app/referral/${user.referral_code}` : ''

  const handleCopy = async () => {
    if (!referralLink) return

    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>
        <p className="text-sm text-gray-600 mb-4">
          Share this link with friends to earn rewards when they register and play!
        </p>

        <div className="flex items-center mb-4">
          <div className="flex-1 border border-gray-300 rounded-l-lg p-3 bg-gray-50 overflow-hidden whitespace-nowrap overflow-ellipsis">
            {referralLink || 'Loading referral code...'}
          </div>
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg transition-colors"
            disabled={!referralLink}
          >
            {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
          </button>
        </div>

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-green-600 mb-4"
          >
            Copied to clipboard!
          </motion.div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">How Referrals Work</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600">1</span>
            </div>
            <div>
              <h3 className="font-medium">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Send your referral link to friends who might be interested in Fragmetric.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600">2</span>
            </div>
            <div>
              <h3 className="font-medium">Friends Register</h3>
              <p className="text-sm text-gray-600">
                When they register using your link, they'll be connected to your account.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <span className="text-blue-600">3</span>
            </div>
            <div>
              <h3 className="font-medium">Earn Rewards</h3>
              <p className="text-sm text-gray-600">You'll earn points when they play games and complete tasks!</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <FiUsers className="mr-2" />
          Your Referrals
        </h2>

        {user?.referrals && user.referrals.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Username</th>
                  <th className="text-center p-3 text-sm font-medium text-gray-600">Joined</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {user.referrals.map((referral, index) => (
                  <tr
                    key={referral.id}
                    className={index !== (user.referrals?.length ?? 0) - 1 ? 'border-b border-gray-100' : ''}
                  >
                    <td className="p-3 text-sm">{referral.username}</td>
                    <td className="p-3 text-sm text-center text-gray-600">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm text-right font-medium">+{referral.points_earned || 0} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">You don't have any referrals yet</p>
            <p className="text-sm text-gray-600">Share your link to start earning rewards!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralInfo

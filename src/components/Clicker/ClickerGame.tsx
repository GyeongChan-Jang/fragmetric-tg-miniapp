import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import Confetti from 'react-confetti'
import Image from 'next/image'
import { useClickerStore } from '@/store/clickerStore'
import { useUserStore } from '@/store/userStore'
import { MAX_BOOST } from '@/store/userStore'

interface ClickPoint {
  id: number
  x: number
  y: number
  value: number
}

export const ClickerGame: React.FC = () => {
  const { user, updateClickerScore, boost, useBoost: decreaseBoost, refreshBoost, getRank } = useUserStore()
  const { incrementClicks, setIsAnimating, isAnimating } = useClickerStore()

  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([])
  const [nextId, setNextId] = useState(0)
  const [lastMilestoneReached, setLastMilestoneReached] = useState(0)
  const [showUpgrades, setShowUpgrades] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const clickSound = useRef<HTMLAudioElement>(null)

  // 버튼 틸트 애니메이션을 위한 상태
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)

  // 부드러운 틸트 애니메이션을 위한 스프링 설정
  const springTiltX = useSpring(0, { stiffness: 300, damping: 20 })
  const springTiltY = useSpring(0, { stiffness: 300, damping: 20 })

  const rank = getRank()

  // MILESTONES를 useMemo로 이동
  const MILESTONES = useMemo(() => [100, 500, 1000, 5000, 10000], [])

  // springTiltX, springTiltY 값이 변경될 때마다 tiltX, tiltY 값을 업데이트
  useEffect(() => {
    springTiltX.onChange((latest) => {
      setTiltX(latest)
    })
    springTiltY.onChange((latest) => {
      setTiltY(latest)
    })
  }, [springTiltX, springTiltY])

  // 필요할 때 Boost 보충
  useEffect(() => {
    refreshBoost()
  }, [refreshBoost])

  // 윈도우 사이즈 설정
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 마일스톤 체크
  useEffect(() => {
    if (!user) return

    const totalScore = user.clicker_score || 0

    for (const milestone of MILESTONES) {
      if (totalScore >= milestone && lastMilestoneReached < milestone) {
        setShowConfetti(true)
        setLastMilestoneReached(milestone)
        setTimeout(() => setShowConfetti(false), 3000)
        break
      }
    }
  }, [user?.clicker_score, lastMilestoneReached, MILESTONES, user])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnimating) return

    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play().catch((err: Error) => console.error('Audio play failed:', err))
    }

    setIsAnimating(true)

    // 올바른 메서드명 사용 (React Hook이 아님)
    const boostAmount = boost > 0 ? 1 : 0
    const points = incrementClicks() + boostAmount
    updateClickerScore(points)

    // boost 사용하기 (React Hook이 아닌 상태 업데이트 함수)
    if (boost > 0) {
      decreaseBoost(1)
    }

    // 클릭 포인트 애니메이션 추가
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return

    // 클릭한 위치에 상대적인 좌표 계산
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPoint: ClickPoint = {
      id: nextId,
      x,
      y,
      value: 1
    }

    setClickPoints((prev) => [...prev, newPoint])
    setNextId((prev) => prev + 1)

    setTimeout(() => {
      setClickPoints((prev) => prev.filter((point) => point.id !== newPoint.id))
    }, 1000)

    // 클릭 애니메이션 시작
    setTimeout(() => setIsAnimating(false), 300)

    // 클릭 위치에 따른 틸트 효과 계산
    // 중앙을 기준으로 상대적인 위치 (-1 ~ 1 범위)
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // 중앙에서 얼마나 떨어졌는지 계산 (-1 ~ 1 범위로 정규화)
    const offsetX = (x - centerX) / centerX
    const offsetY = (y - centerY) / centerY

    // 틸트 각도 설정 (최대 15도)
    springTiltX.set(-offsetY * 15) // Y축 기준으로 틸트 (위/아래 클릭 = X축 회전)
    springTiltY.set(offsetX * 15) // X축 기준으로 틸트 (좌/우 클릭 = Y축 회전)

    // 0.1초 후 원래 위치로 복귀
    setTimeout(() => {
      springTiltX.set(0)
      springTiltY.set(0)
    }, 100)
  }

  // 클릭 포인트 렌더링
  const renderClickPoints = () => {
    return clickPoints.map((point) => (
      <motion.div
        key={point.id}
        initial={{ opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 0, y: -30, scale: 1.2 }}
        transition={{ duration: 0.8 }}
        className="absolute text-green-500 font-bold text-lg"
        style={{ left: point.x, top: point.y, zIndex: 10 }}
      >
        +{point.value}
      </motion.div>
    ))
  }

  // 랭크 배지 렌더링
  const renderRankBadge = () => {
    if (rank === 'unranked') return null

    const rankLabels = {
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum',
      diamond: 'Diamond'
    }

    return <div className={`rank-badge rank-${rank}`}>{rankLabels[rank as keyof typeof rankLabels]}</div>
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white text-gray-800 p-4 rounded-lg">
      <audio ref={clickSound} preload="auto" src="/sounds/click.mp3" />

      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
        />
      )}

      <AnimatePresence>
        {lastMilestoneReached > 0 && showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -50 }}
            className="fixed top-24 left-0 right-0 mx-auto z-20 bg-blue-500 text-white p-3 rounded-lg shadow-lg text-center w-4/5"
          >
            <h3 className="text-lg font-bold">🎉 Milestone Reached! 🎉</h3>
            <p>{lastMilestoneReached} points</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-4 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Score</h2>
          {renderRankBadge()}
        </div>
        <h2 className="text-3xl font-bold text-blue-600">{user?.clicker_score || 0}</h2>
        <p className="text-gray-600">Score</p>
      </div>

      <div className="relative flex justify-center items-center h-60 w-60 bg-gray-100 rounded-full shadow-inner mb-8 perspective-500">
        <AnimatePresence>
          {clickPoints.map((point) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute text-green-600 font-bold text-lg"
              style={{ left: point.x, top: point.y, zIndex: 20 }}
            >
              +{point.value}
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          ref={buttonRef}
          whileTap={{ scale: 0.9 }}
          animate={isAnimating ? { scale: 0.9 } : { scale: 1 }}
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d'
          }}
          className="h-48 w-48 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl perspective-500"
          onClick={handleClick}
        >
          <Image
            src="/images/topu-face-sang.png"
            alt="Topu"
            width={160}
            height={160}
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%234299e1'/%3E%3Ctext x='60' y='70' font-family='Arial' font-size='20' text-anchor='middle' fill='white'%3ETopu%3C/text%3E%3C/svg%3E"
            }}
          />
        </motion.div>
      </div>

      <div className="w-full mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Boost</span>
          <span>
            {boost}/{MAX_BOOST}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(boost / MAX_BOOST) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">Boost refills every 24 hours</p>
      </div>

      <AnimatePresence>
        {boost <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full p-4 rounded-lg bg-red-100 border border-red-300 text-center mb-4"
          >
            <p className="text-red-600">Out of boost! Wait for it to refill or come back later.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClickerGame

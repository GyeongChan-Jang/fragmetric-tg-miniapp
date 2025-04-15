import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createChart, CrosshairMode, IChartApi, ISeriesApi, Time, CandlestickSeries, BarData } from 'lightweight-charts'
import { useBettingStore } from '@/store/bettingStore'
import { useUserStore } from '@/store/userStore'
import { useWalletStore } from '@/store/walletStore'
import { BetType, Bet } from '@/types'
import BettingHistory from './BettingHistory'

type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'

// 결과 모달 컴포넌트
interface ResultModalProps {
  isOpen: boolean
  result: 'WIN' | 'LOSE' | 'DRAW' | null
  startPrice: number
  endPrice: number
  betType: BetType | null
  scoreEarned: number
  onClose: () => void
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  result,
  startPrice,
  endPrice,
  betType,
  scoreEarned,
  onClose
}) => {
  if (!isOpen || !result || !betType) return null

  const isWin = result === 'WIN'
  const isDraw = result === 'DRAW'
  const bgColor = isWin ? 'bg-green-100' : isDraw ? 'bg-yellow-100' : 'bg-red-100'
  const borderColor = isWin ? 'border-green-300' : isDraw ? 'border-yellow-300' : 'border-red-300'
  const titleColor = isWin ? 'text-green-600' : isDraw ? 'text-yellow-600' : 'text-red-600'
  const iconBg = isWin ? 'bg-green-500' : isDraw ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`${bgColor} ${borderColor} border-2 rounded-lg p-6 w-full max-w-sm shadow-lg`}
      >
        <div className="flex flex-col items-center mb-4">
          <div className={`${iconBg} text-white p-3 rounded-full mb-2`}>
            {isWin ? 
              <img src="/images/good_topu.webp" alt="win" /> : 
              isDraw ? 
              <img src="/images/draw-topu.webp" alt="draw" /> : 
              <img src="/images/bonk_topu.webp" alt="lose" />
            }
          </div>
          <h3 className={`mt-2 text-xl font-bold ${titleColor}`}>
            {isWin ? '🎉 You Won!' : isDraw ? '😐 It\'s a Draw!' : '😢 You Lost'}
          </h3>
        </div>

        {/* <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Bet Type:</div>
            <div className={`font-semibold ${betType === 'UP' ? 'text-green-600' : 'text-red-600'}`}>{betType}</div>

            <div className="text-gray-600">Start Price:</div>
            <div className="font-semibold">${startPrice.toFixed(2)}</div>

            <div className="text-gray-600">End Price:</div>
            <div className="font-semibold">${endPrice.toFixed(2)}</div>

            <div className="text-gray-600">Result:</div>
            <div className={`font-semibold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
              {isWin ? `+${scoreEarned} points` : 'No points'}
            </div>
          </div>
        </div> */}

        {/* <div className={`text-center p-2 rounded-md ${isWin ? 'bg-green-200' : 'bg-red-200'} mb-4`}>
          {isWin
            ? `Congratulations! You predicted correctly and earned ${scoreEarned} points.`
            : `Better luck next time. The price moved against your prediction.`}
        </div> */}

        <button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
          Continue
        </button>
      </motion.div>
    </div>
  )
}

export const SolBetting: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1m')
  const [isChartReady, setIsChartReady] = useState(false)

  // 결과 모달 상태
  const [showModal, setShowModal] = useState(false)
  const [betResult, setBetResult] = useState<'WIN' | 'LOSE' | 'DRAW' | null>(null)
  const [resultData, setResultData] = useState({
    startPrice: 0,
    endPrice: 0,
    betType: null as BetType | null,
    scoreEarned: 0
  })

  const { user } = useUserStore()
  const { isConnected } = useWalletStore()
  const {
    bets,
    currentBet,
    candleData,
    currentPrice,
    countdown,
    isLoading,
    error,
    setBets,
    setCurrentPrice,
    setCountdown,
    placeBet,
    fetchBettingHistory,
    updateBetResult
  } = useBettingStore()

  // 최대 일일 베팅 횟수
  const MAX_DAILY_BETS = 20
  const remainingBets = user ? MAX_DAILY_BETS - user.daily_bets : 0

  // 차트 초기화 함수
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current || chartRef.current) return

    try {
      const newChart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333'
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' }
        },
        crosshair: {
          mode: CrosshairMode.Normal
        },
        rightPriceScale: {
          borderColor: '#f0f0f0'
        },
        timeScale: {
          borderColor: '#f0f0f0',
          timeVisible: true
        },
        handleScroll: {
          vertTouchDrag: true
        },
        handleScale: {
          axisPressedMouseMove: true
        }
      })

      // 캔들스틱 시리즈 추가
      const newCandleSeries = newChart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      })

      chartRef.current = newChart
      candleSeriesRef.current = newCandleSeries
      setIsChartReady(true)

      // 차트 리사이즈 처리
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth
          })
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    } catch (error) {
      console.error('차트 초기화 오류:', error)
    }
  }, [])

  // 차트 정리 함수
  const cleanupChart = useCallback(() => {
    try {
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        candleSeriesRef.current = null
        setIsChartReady(false)
      }
    } catch (error) {
      console.error('차트 정리 오류:', error)
    }
  }, [])

  // 차트 초기화 및 정리
  useEffect(() => {
    initializeChart()

    return () => {
      cleanupChart()
    }
  }, [initializeChart, cleanupChart])

  // 차트 데이터 가져오기 함수 - 초기 데이터용
  const fetchCandleData = useCallback(async () => {
    if (!isChartReady || !candleSeriesRef.current) return

    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=${timeFrame}&limit=100`
      )
      const data = await response.json()

      if (data && data.length > 0 && candleSeriesRef.current) {
        const formattedData = data.map((item: any) => ({
          time: (item[0] / 1000) as Time,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4])
        }))

        // 차트가 존재할 때만 데이터 설정
        candleSeriesRef.current.setData(formattedData)

        // 현재 가격 업데이트
        const lastPrice = parseFloat(data[data.length - 1][4])
        setCurrentPrice(lastPrice)

        // 차트 영역 맞추기
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent()
        }
      }
    } catch (error) {
      console.error('캔들 데이터 가져오기 오류:', error)
    }
  }, [timeFrame, isChartReady, setCurrentPrice])

  // WebSocket 연결 설정 함수
  const setupWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close()
    }

    // Binance WebSocket 엔드포인트 - 심볼과 타임프레임에 맞는 kline/candlestick 스트림
    const wsEndpoint = `wss://stream.binance.com:9443/ws/solusdt@kline_${timeFrame}`
    const ws = new WebSocket(wsEndpoint)

    ws.onopen = () => {
      console.log('WebSocket 연결 성공')
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.k && candleSeriesRef.current) {
          const { t, o, h, l, c, v, T, i } = message.k
          
          // 새 캔들스틱 데이터
          const candleData = {
            time: (t / 1000) as Time,
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c)
          }

          // 현재 가격 업데이트
          setCurrentPrice(parseFloat(c))

          // 차트 업데이트 - 새 데이터 또는 마지막 캔들 업데이트
          candleSeriesRef.current.update(candleData)
        }
      } catch (error) {
        console.error('WebSocket 메시지 처리 오류:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket 오류:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket 연결 종료')
    }

    websocketRef.current = ws

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [timeFrame, setCurrentPrice])

  // 베팅 결과 처리 함수
  const processBetResult = useCallback(() => {
    if (!currentBet || !currentPrice) return

    // 승패 결정
    const startPrice = currentBet.sol_price_start
    const endPrice = currentPrice
    const betType = currentBet.type
    
    // DRAW 추가: 시작가와 종료가가 같으면 DRAW 처리
    let result: 'WIN' | 'LOSE' | 'DRAW'
    
    if (startPrice === endPrice) {
      result = 'DRAW'
    } else if (betType === 'UP') {
      result = endPrice > startPrice ? 'WIN' : 'LOSE'
    } else { // betType === 'DOWN'
      result = endPrice < startPrice ? 'WIN' : 'LOSE'
    }

    // 획득 점수 계산 - DRAW일 경우 0점
    const scoreEarned = result === 'WIN' ? 100 : 0 // DRAW or LOSE: 0 points

    // 결과 모달 데이터 설정
    setBetResult(result)
    setResultData({
      startPrice,
      endPrice,
      betType,
      scoreEarned: result === 'WIN' ? 10 : 0
    })

    // 베팅 결과 업데이트
    if (result === 'DRAW') {
      // Handle DRAW case specifically if needed
      updateBetResult(currentBet.id, endPrice, 'DRAW', scoreEarned)
    } else {
      updateBetResult(currentBet.id, endPrice, result, scoreEarned)
    }

    // 모달 표시
    setShowModal(true)
  }, [currentBet, currentPrice, updateBetResult])

  // 데이터 로드 및 업데이트
  useEffect(() => {
    if (!isChartReady) return

    // 베팅 데이터 가져오기
    if (user?.id) {
      fetchBettingHistory(user.id)
    }

    // 초기 데이터 로드
    fetchCandleData().then(() => {
      // 초기 데이터 로드 후 WebSocket 연결
      setupWebSocket()
    })

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [fetchCandleData, isChartReady, fetchBettingHistory, user?.id, setupWebSocket])

  // 타임프레임 변경시 데이터 다시 로드 및 WebSocket 재연결
  useEffect(() => {
    if (isChartReady) {
      fetchCandleData().then(() => {
        setupWebSocket()
      })
    }
  }, [timeFrame, fetchCandleData, isChartReady, setupWebSocket])

  // 타임프레임에 따른 초 단위 변환
  const getTimeFrameSeconds = (tf: TimeFrame): number => {
    switch (tf) {
      case '1m':
        return 60
      case '5m':
        return 300
      case '15m':
        return 900
      case '1h':
        return 3600
      case '4h':
        return 14400
      case '1d':
        return 86400
      default:
        return 60
    }
  }

  // 타임프레임 변경 핸들러
  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame)
  }

  // 카운트다운 처리
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    } else if (countdown === 0 && currentBet) {
      // 카운트다운이 끝나면 베팅 결과 처리
      processBetResult()
    }
  }, [countdown, setCountdown, currentBet, processBetResult])

  // 사용자 베팅 처리
  const handlePlaceBet = (type: BetType) => {
    if (isLoading || currentBet || !user || user.daily_bets >= MAX_DAILY_BETS) return

    placeBet(type)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false)
  }

  // 버튼 비활성화 여부 확인
  const isBetButtonDisabled = remainingBets <= 0 || isLoading || !!currentBet

  return (
    <div className="flex flex-col w-full bg-white text-gray-800 p-4 rounded-lg">
      {/* 차트 컨테이너 */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">SOL/USDT</h2>
          <div className="flex space-x-1">
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                className={`px-2 py-1 text-xs rounded ${
                  timeFrame === tf ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleTimeFrameChange(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div ref={chartContainerRef} className="h-[300px]" />
        </div>
      </div>

      {/* 현재 가격 표시 */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="text-2xl font-bold text-blue-600">${currentPrice.toFixed(2)}</p>
        </div>

        {currentBet && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Time Left</p>
            <p className={`text-xl font-bold ${countdown === 0 ? 'text-red-500' : 'text-green-500'}`}>{countdown}s</p>
          </div>
        )}
      </div>

      {/* 베팅 버튼 */}
      {!currentBet && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePlaceBet('UP')}
            disabled={isBetButtonDisabled}
          >
            <span className="mr-2">▲</span>
            <span>UP</span>
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePlaceBet('DOWN')}
            disabled={isBetButtonDisabled}
          >
            <span className="mr-2">▼</span>
            <span>DOWN</span>
          </button>
        </div>
      )}

      {/* 현재 베팅 정보 */}
      {currentBet && (
        <div className={`mb-4 p-3 rounded-lg ${currentBet.type === 'UP' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Your Bet</p>
              <p className={`text-lg font-semibold ${currentBet.type === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                {currentBet.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Starting Price</p>
              <p className="text-lg font-semibold text-gray-800">${currentBet.sol_price_start.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 남은 베팅 횟수 */}
      <div className="mb-4 bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600">Remaining Bets Today</p>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${(remainingBets / MAX_DAILY_BETS) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {remainingBets}/{MAX_DAILY_BETS}
          </span>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-600">{error}</div>}

      {/* 베팅 히스토리 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Betting History</h3>
        <BettingHistory bets={bets} />
      </div>

      {/* 결과 모달 */}
      <AnimatePresence>
        {showModal && (
          <ResultModal
            isOpen={showModal}
            result={betResult}
            startPrice={resultData.startPrice}
            endPrice={resultData.endPrice}
            betType={resultData.betType}
            scoreEarned={resultData.scoreEarned}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SolBetting

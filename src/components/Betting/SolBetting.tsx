import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createChart, CrosshairMode, IChartApi, ISeriesApi, Time, CandlestickSeries, BarData } from 'lightweight-charts'
import { useBettingStore } from '@/store/bettingStore'
import { useUserStore } from '@/store/userStore'
import { useWalletStore } from '@/store/walletStore'
import { BetType, Bet } from '@/types'
import BettingHistory from './BettingHistory'

type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'

export const SolBetting: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<IChartApi | null>(null)
  const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | null>(null)
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1m')

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
    addBet,
    setCurrentBet
  } = useBettingStore()

  // 최대 일일 베팅 횟수
  const MAX_DAILY_BETS = 10
  const remainingBets = user ? MAX_DAILY_BETS - user.daily_bets : 0

  // 차트 초기화
  useEffect(() => {
    if (chartContainerRef.current && !chart) {
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
        // 툴바 활성화
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

      setChart(newChart)
      setCandleSeries(newCandleSeries)

      // 차트 리사이즈 처리
      const handleResize = () => {
        if (chartContainerRef.current && newChart) {
          newChart.applyOptions({
            width: chartContainerRef.current.clientWidth
          })
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        newChart.remove()
      }
    }
  }, [])

  // Binance API를 사용하여 SOL 캔들스틱 데이터 가져오기
  useEffect(() => {
    if (!candleSeries) return

    const fetchCandleData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=${timeFrame}&limit=100`
        )
        const data = await response.json()

        if (data && data.length > 0) {
          const formattedData = data.map((item: any) => ({
            time: (item[0] / 1000) as Time,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4])
          }))

          candleSeries.setData(formattedData)

          // 현재 가격 업데이트
          const lastPrice = parseFloat(data[data.length - 1][4])
          setCurrentPrice(lastPrice)

          // 차트 영역 맞추기
          chart?.timeScale().fitContent()
        }
      } catch (error) {
        console.error('Failed to fetch candle data from Binance:', error)
        fallbackToMockData()
      }
    }

    // API 오류 시 대체 데이터
    const fallbackToMockData = () => {
      const now = Math.floor(Date.now() / 1000)
      const mockData = Array.from({ length: 100 }, (_, i) => {
        const time = now - (99 - i) * getTimeFrameSeconds(timeFrame)
        const basePrice = 120 + Math.random() * 5
        const fluctuation = Math.random() * 2 - 1 // -1 to 1

        const open = basePrice
        const close = basePrice * (1 + fluctuation * 0.01)
        const high = Math.max(open, close) * (1 + Math.random() * 0.005)
        const low = Math.min(open, close) * (1 - Math.random() * 0.005)

        return {
          time: time as Time,
          open,
          high,
          low,
          close
        }
      })

      candleSeries.setData(mockData)
      setCurrentPrice(mockData[mockData.length - 1].close)
    }

    fetchCandleData()

    // Binance 웹소켓을 통한 실시간 업데이트
    const binanceWs = new WebSocket(`wss://stream.binance.com:9443/ws/solusdt@kline_${timeFrame}`)

    binanceWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.k) {
          const candle = data.k
          const newCandle = {
            time: (candle.t / 1000) as Time,
            open: parseFloat(candle.o),
            high: parseFloat(candle.h),
            low: parseFloat(candle.l),
            close: parseFloat(candle.c)
          }

          candleSeries.update(newCandle)
          setCurrentPrice(newCandle.close)

          // 베팅 결과 확인
          if (currentBet && countdown === 0) {
            const result =
              currentBet.type === 'UP'
                ? newCandle.close > currentBet.sol_price_start
                  ? 'WIN'
                  : 'LOSE'
                : newCandle.close < currentBet.sol_price_start
                ? 'WIN'
                : 'LOSE'

            const scoreEarned = result === 'WIN' ? 20 : 0

            // 새 베팅 업데이트
            const updatedBet: Bet = {
              ...currentBet,
              result,
              score_earned: scoreEarned,
              sol_price_end: newCandle.close
            }

            // 베팅 결과 저장
            addBet(updatedBet)
            setCurrentBet(null)
          }
        }
      } catch (error) {
        console.error('Failed to process Binance websocket data:', error)
      }
    }

    binanceWs.onerror = (error) => {
      console.error('Binance websocket error:', error)

      // 웹소켓 오류 시 폴백으로 일반 폴링 사용
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT')
          const data = await response.json()
          const newPrice = parseFloat(data.price)

          setCurrentPrice(newPrice)

          // 베팅 결과 확인
          if (currentBet && countdown === 0) {
            const result =
              currentBet.type === 'UP'
                ? newPrice > currentBet.sol_price_start
                  ? 'WIN'
                  : 'LOSE'
                : newPrice < currentBet.sol_price_start
                ? 'WIN'
                : 'LOSE'

            const scoreEarned = result === 'WIN' ? 20 : 0

            // 새 베팅 업데이트
            const updatedBet: Bet = {
              ...currentBet,
              result,
              score_earned: scoreEarned,
              sol_price_end: newPrice
            }

            // 베팅 결과 저장
            addBet(updatedBet)
            setCurrentBet(null)
          }
        } catch (e) {
          console.error('Failed to fetch SOL price from Binance API:', e)
        }
      }, 3000)

      return () => clearInterval(intervalId)
    }

    return () => {
      binanceWs.close()
    }
  }, [candleSeries, timeFrame, currentBet, countdown, chart])

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

      return () => clearTimeout(timer)
    }
  }, [countdown, setCountdown])

  // 사용자 베팅 처리
  const handlePlaceBet = (type: BetType) => {
    if (!isConnected) {
      // 지갑이 연결되지 않은 경우 오류 메시지 표시
      useBettingStore.getState().resetError()
      useBettingStore.setState({ error: 'TON 지갑 연결이 필요합니다. 상단의 Connect 버튼을 클릭하세요.' })
      return
    }

    if (isLoading || currentBet || !user || user.daily_bets >= MAX_DAILY_BETS) return

    placeBet(type)
  }

  // 버튼 비활성화 여부 확인
  const isBetButtonDisabled = !isConnected || remainingBets <= 0 || isLoading || !!currentBet

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

      {!isConnected && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-700">
          SOL 베팅을 위해 상단의 TON 지갑 연결 버튼을 클릭하여 지갑을 연결해 주세요.
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-600">{error}</div>}

      {/* 베팅 히스토리 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Betting History</h3>
        <BettingHistory bets={bets} />
      </div>
    </div>
  )
}

export default SolBetting

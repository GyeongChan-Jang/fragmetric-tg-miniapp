# FragTopu: Telegram Mini App

<div align="center">
  <img src="./assets/telegram-miniapp-banner.png" alt="FragTopu Telegram Mini App" width="600"/>
  <p><em>게임과 소셜 경험을 제공하는 텔레그램 미니앱 플랫폼</em></p>
</div>

## 프로젝트 개요

FragTopu는 Telegram Mini App 플랫폼에서 실행되는 게임 및 소셜 경험을 제공하는 웹 애플리케이션입니다. 사용자는 클리커 게임을 플레이하고, SOL 가격 예측 베팅에 참여하며, 리더보드를 통해 친구들과 경쟁할 수 있습니다. 모든 기능은 Telegram의 사용자 인증을 활용하며 Supabase를 통한 서버리스 백엔드로 구현되었습니다.

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [아키텍처](#아키텍처)
- [구현 세부사항](#구현-세부사항)
- [기술적 도전과 해결책](#기술적-도전과-해결책)
- [성능 최적화](#성능-최적화)
- [데모 및 스크린샷](#데모-및-스크린샷)
- [설치 및 개발 가이드](#설치-및-개발-가이드)

## 주요 기능

### 1. 클리커 게임

<div align="center">
  <img src="./assets/clicker-game.gif" alt="Clicker Game" width="300"/>
</div>

- **인터랙티브 클리커 메커니즘**

  - 3D 틸트 효과와 함께 버튼 애니메이션
  - 클릭 포인트에 점수 표시 (+1, +2)
  - 부스트 시스템으로 한정된 시간 동안 추가 점수 획득

- **진행 시스템**
  - 마일스톤 달성 시 축하 효과
  - 클릭 통계 및 점수 추적
  - 다양한 랭크 시스템(브론즈, 실버, 골드 등)

### 2. SOL 가격 예측 베팅

<div align="center">
  <img src="./assets/betting-game.gif" alt="SOL Betting Game" width="300"/>
</div>

- **실시간 차트 시스템**

  - Binance API를 활용한 SOL/USDT 실시간 가격 차트
  - 다양한 타임프레임 지원 (1m, 5m, 15m, 1h, 4h, 1d)
  - 캔들스틱 차트로 가격 추세 시각화

- **베팅 메커니즘**
  - 상승(UP) 또는 하락(DOWN) 예측 베팅
  - 결과에 따른 점수 보상 시스템
  - 결과 발표 애니메이션 및 시각적 피드백
  - 일일 베팅 제한으로 균형 있는 게임 플레이

### 3. 리더보드 및 소셜 기능

<div align="center">
  <img src="./assets/leaderboard.png" alt="Leaderboard" width="300"/>
</div>

- **멀티 뷰 리더보드**

  - 글로벌 랭킹 및 친구 필터링
  - 카테고리별 점수 확인 (전체, 클리커, 베팅)

- **친구 추천 시스템**
  - 고유 추천 코드 및 링크 생성
  - 친구 초대 시 보상 획득
  - 추천 통계 및 추적

### 4. 과제 및 보상 시스템

<div align="center">
  <img src="./assets/tasks.png" alt="Tasks" width="300"/>
</div>

- **다양한 과제 유형**
  - 일일 과제: 매일 재설정되는 활동 기반 과제
  - 소셜 과제: 친구 초대 및 사회적 상호작용 과제
  - 일회성 과제: 주요 성과 달성 관련 과제
- **보상 체계**
  - 과제 완료 시 점수 보상
  - 진행 상황 추적 및 시각화
  - 완료된 과제의 기록 유지

## 기술 스택

### 프론트엔드

- **Next.js 14**: 파일 기반 라우팅, 정적 생성(Static Export)
- **TypeScript**: 타입 안정성 및 개발 경험 향상
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Framer Motion**: 고성능 애니메이션 라이브러리
- **Lightweight Charts**: 트레이딩 차트 시각화

### 상태 관리 및 데이터 흐름

- **Zustand**: 경량 상태 관리 라이브러리
- **Supabase Client**: 데이터베이스 상호작용

### 백엔드

- **Supabase**: 서버리스 백엔드 및 데이터베이스
- **Edge Functions**: 서버리스 함수 실행 환경
- **PostgreSQL**: 관계형 데이터베이스

### 통합 및 API

- **Telegram Mini Apps SDK**: Telegram 플랫폼 통합
- **TON Connect**: TON 블록체인 지갑 연결
- **Binance API**: 암호화폐 가격 데이터

## 아키텍처

### 시스템 아키텍처

<div align="center">
  <img src="./assets/architecture.png" alt="System Architecture" width="700"/>
</div>

FragTopu는 클라이언트-서버리스 아키텍처를 따릅니다:

1. **Static Next.js 애플리케이션**

   - 정적으로 생성된 웹 애플리케이션 (SSG)
   - CDN을 통한 전역 배포로 빠른 로딩 속도
   - 클라이언트 측 데이터 페칭 및 상태 관리

2. **Supabase 서버리스 백엔드**

   - PostgreSQL 데이터베이스: 사용자, 게임, 리더보드 데이터 저장
   - Edge Functions: Telegram 인증, 보안 처리, 외부 API 통합
   - 실시간 구독: 리더보드 및 베팅 결과 실시간 업데이트

3. **외부 통합**
   - Telegram Bot API: 사용자 인증 및 미니앱 진입점
   - Binance API: 암호화폐 가격 데이터
   - TON Wallet: 블록체인 지갑 연결 기능 (확장성)

### 데이터 흐름

<div align="center">
  <img src="./assets/data-flow.png" alt="Data Flow" width="600"/>
</div>

1. **사용자 인증 흐름**

   ```mermaid
   sequenceDiagram
       participant User
       participant Telegram
       participant MiniApp
       participant Edge
       participant Supabase

       User->>Telegram: 봇/미니앱 실행
       Telegram->>MiniApp: initData 제공
       MiniApp->>Edge: initData 전송
       Edge->>Edge: HMAC 검증
       Edge->>Supabase: 사용자 조회/생성
       Supabase->>Edge: 사용자 정보
       Edge->>MiniApp: 인증 결과
       MiniApp->>User: 앱 UI 표시
   ```

2. **상태 관리 아키텍처**
   - Zustand 스토어를 통한 모듈화된 상태 관리
   - 지속성 계층으로 로컬 스토리지 활용
   - Supabase 클라이언트를 통한 서버 동기화

## 구현 세부사항

### 1. 게임 메커니즘

#### 클리커 게임

```typescript
// 클릭 핸들링 및 3D 틸트 효과
const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  // 클릭 지점 계산 및 애니메이션 적용
  const rect = buttonRef.current?.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 3D 틸트 효과 계산
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const offsetX = (x - centerX) / centerX
  const offsetY = (y - centerY) / centerY

  // 스프링 애니메이션으로 자연스러운 틸트
  springTiltX.set(-offsetY * 20)
  springTiltY.set(offsetX * 20)

  // 점수 계산 및 애니메이션
  const boostAmount = boost > 0 ? 1 : 0
  const points = 1 + boostAmount
  updateClickerScore(points)

  // 점수 표시 애니메이션
  setClickPoints((prev) => [...prev, { id: nextId, x, y, value: points }])
}
```

#### SOL 베팅 게임

```typescript
// 베팅 결과 처리 및 보상 계산
const processBetResult = useCallback(() => {
  if (!currentBet || !currentPrice) return

  // 승패 결정 로직
  const startPrice = currentBet.sol_price_start
  const endPrice = currentPrice
  const betType = currentBet.type
  const result = betType === 'UP' ? (endPrice > startPrice ? 'WIN' : 'LOSE') : endPrice < startPrice ? 'WIN' : 'LOSE'

  // 보상 계산
  const scoreEarned = result === 'WIN' ? 10 : 0

  // 결과 업데이트 및 모달 표시
  setBetResult(result)
  setResultData({
    startPrice,
    endPrice,
    betType,
    scoreEarned: result === 'WIN' ? 10 : 0
  })

  // 데이터베이스 업데이트
  updateBetResult(currentBet.id, endPrice, result, scoreEarned)
  setShowModal(true)
}, [currentBet, currentPrice, updateBetResult])
```

### 2. Telegram 통합

#### 미니앱 초기화

```typescript
// Root.tsx - Telegram 미니앱 초기화
function RootInner({ children }: PropsWithChildren) {
  // Telegram 환경 모킹 (개발용)
  useTelegramMock()

  // 런치 파라미터 및 디버그 설정
  const lp = useLaunchParams()
  const debug = process.env.NODE_ENV === 'development' || lp.startParam === 'debug'

  // 라이브러리 초기화
  useClientOnce(() => {
    init(debug)
  })

  // Telegram 테마 및 언어 설정
  const isDark = useSignal(miniApp.isDark)
  const initDataUser = useSignal(initData.user)

  useEffect(() => {
    initDataUser && setLocale(initDataUser.languageCode)
  }, [initDataUser])

  // TON Connect 및 UI 테마 적용
  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  )
}
```

#### 사용자 인증

```typescript
// useTelegramAuth.ts - Telegram 사용자 인증 훅
export function useTelegramAuth(): TelegramAuthHook {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, setUser, initUser } = useUserStore()

  // Telegram SDK에서 사용자 정보 가져오기
  const initDataUser = useSignal(initData.user)

  // 인증 초기화 함수
  const initTelegramAuth = useCallback(async () => {
    setIsLoading(true)

    try {
      if (initDataUser) {
        // Edge Function으로 사용자 검증 요청
        const { data, error } = await supabase.functions.invoke('verify-telegram', {
          body: { user: initDataUser }
        })

        if (error || !data.success) throw new Error('User verification failed')

        // 검증 성공 시 사용자 정보 저장
        setUser(data.user as User)
        setIsAuthenticated(true)
        localStorage.setItem('user-id', data.user.id)
      } else {
        // SDK에서 데이터를 가져올 수 없는 경우 로컬 사용자 확인
        const storedUserId = localStorage.getItem('user-id')

        if (storedUserId && storedUserId !== 'local-user') {
          // 기존 사용자 정보 조회
          const { data } = await supabase.from('users').select('*').eq('id', storedUserId).single()

          if (data) {
            setUser(data as User)
            setIsAuthenticated(true)
          } else {
            initUser()
          }
        } else {
          initUser()
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증에 실패했습니다')
      initUser()
    } finally {
      setIsLoading(false)
    }
  }, [initDataUser, setUser, initUser])

  return { isLoading, error, user, isAuthenticated, initTelegramAuth }
}
```

### 3. 상태 관리 및 데이터 지속성

```typescript
// userStore.ts - Zustand 스토어 구현
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      boost: MAX_BOOST,
      lastBoostRefresh: null,

      // 사용자 설정 함수
      setUser: (user) => set({ user }),

      // 점수 업데이트 함수
      updateClickerScore: (increment) =>
        set((state) => {
          if (!state.user) return { user: { ...defaultUser, clicker_score: increment } }

          const newClickerScore = (state.user.clicker_score || 0) + increment
          const betting = state.user.betting_score || 0
          const newTotalScore = betting + newClickerScore

          const updatedUser = {
            ...state.user,
            clicker_score: newClickerScore,
            total_score: newTotalScore,
            last_click_time: new Date()
          }

          // 비동기적으로 Supabase에 업데이트
          get().saveUserToSupabase()

          return { user: updatedUser }
        }),

      // Supabase 동기화 함수
      saveUserToSupabase: async () => {
        const user = get().user
        if (!user || user.id === 'local-user') return

        try {
          await supabase
            .from('users')
            .update({
              clicker_score: user.clicker_score,
              betting_score: user.betting_score,
              total_score: user.total_score
              // ...기타 필드
            })
            .eq('id', user.id)
        } catch (err) {
          console.error('Error saving user to Supabase:', err)
        }
      }

      // 기타 상태 및 함수...
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        boost: state.boost,
        lastBoostRefresh: state.lastBoostRefresh
      })
    }
  )
)
```

## 기술적 도전과 해결책

### 1. Static Export와 API 라우트 호환성

**도전**: Next.js의 정적 내보내기 모드에서는 API 라우트 및 서버 액션을 사용할 수 없습니다.

**해결책**:

- **API 라우트 대체**: Supabase 클라이언트를 사용하여 클라이언트 측에서 직접 데이터베이스와 통신
- **서버 액션 마이그레이션**: 서버 액션에 의존하는 코드를 클라이언트 측 로직으로 전환
- **인증 처리**: Edge Functions를 활용하여 인증 및 보안 관련 로직 처리

```typescript
// 서버 액션에서 클라이언트 측 로직으로 마이그레이션 예시 (로케일 설정)
// 이전: "use server" 지시문 사용
export async function setLocale(locale: string) {
  const cookieStore = cookies()
  cookieStore.set('NEXT_LOCALE', locale)
  return locale
}

// 이후: 클라이언트 측 쿠키 조작
export function setLocale(locale: string) {
  if (typeof window === 'undefined') return locale

  const date = new Date()
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
  document.cookie = `NEXT_LOCALE=${locale};expires=${date.toUTCString()};path=/`

  return locale
}
```

### 2. Telegram 인증 보안

**도전**: Telegram 미니앱 인증 데이터의 안전한 검증과 사용자 데이터 보호

**해결책**:

- **Edge Function 검증**: `verify-telegram` Edge Function에서 HMAC-SHA256 서명 검증
- **서비스 키 보호**: Supabase 환경 변수를 사용하여 보안 키 관리
- **상태 관리 분리**: 인증 상태와 사용자 데이터를 별도 스토어로 관리

```typescript
// Edge Function에서 Telegram 인증 데이터 검증
serve(async (req) => {
  try {
    const { user } = await req.json()

    // 사용자 데이터 검증
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'Invalid user data' }), { status: 400 })
    }

    // Supabase 클라이언트 초기화
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 기존 사용자 확인
    const { data: existingUser } = await supabase.from('users').select('*').eq('id', user.id.toString()).single()

    // 사용자 생성 또는 업데이트 로직
    // ...

    // 태스크 및 보상 처리
    // ...

    return new Response(JSON.stringify({ success: true, user: userData }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
})
```

### 3. 베팅 게임 실시간 데이터

**도전**: 실시간 가격 데이터를 활용한 베팅 게임 구현 및 결과 처리

**해결책**:

- **Binance API 활용**: 실시간 SOL/USDT 가격 데이터 조회
- **캐싱 및 폴링**: 효율적인 API 호출을 위한 전략 구현
- **공정한 게임 로직**: 명확한 규칙과 투명한 결과 계산

```typescript
// SOL 가격 데이터 가져오기 및 차트 업데이트
const fetchCandleData = useCallback(async () => {
  if (!isChartReady || !candleSeriesRef.current) return

  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=${timeFrame}&limit=100`)
    const data = await response.json()

    // 데이터 포맷팅 및 차트 업데이트
    if (data && data.length > 0) {
      const formattedData = data.map((item) => ({
        time: (item[0] / 1000) as Time,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4])
      }))

      candleSeriesRef.current.setData(formattedData)

      // 현재 가격 업데이트
      const lastPrice = parseFloat(data[data.length - 1][4])
      setCurrentPrice(lastPrice)
    }
  } catch (error) {
    console.error('Error fetching candle data:', error)
  }
}, [timeFrame, isChartReady, setCurrentPrice])

// 주기적 업데이트 설정
useEffect(() => {
  // 초기 데이터 로드
  fetchCandleData()

  // 10초마다 업데이트
  const interval = setInterval(fetchCandleData, 10000)
  return () => clearInterval(interval)
}, [fetchCandleData])
```

### 4. UX/UI 최적화

**도전**: Telegram 미니앱 환경에서의 최적화된 사용자 경험 제공

**해결책**:

- **중첩된 애니메이션**: Framer Motion을 활용한 매끄러운 전환 효과
- **반응형 디자인**: 다양한 화면 크기 및 기기 지원
- **성능 최적화**: 메모이제이션 및 지연 로딩 기법 적용

```typescript
// 성능을 위한 애니메이션 최적화 예시
const buttonVariants = {
  initial: { scale: 1 },
  pressed: { scale: 0.95 },
  tilt: (info: { x: number; y: number }) => ({
    rotateX: info.y * 20,
    rotateY: -info.x * 20,
    transition: { type: 'spring', stiffness: 400, damping: 15 }
  })
}

// 컴포넌트에서 활용
;<motion.div
  ref={buttonRef}
  variants={buttonVariants}
  initial="initial"
  animate={isPressed ? 'pressed' : 'initial'}
  custom={{ x: tiltX, y: tiltY }}
  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
  className="h-48 w-48 bg-blue-500 rounded-full"
  onClick={handleClick}
>
  <Image src="/images/topu.png" alt="Topu" width={160} height={160} />
</motion.div>
```

## 성능 최적화

### 1. 렌더링 성능

- **메모이제이션**: `useMemo` 및 `useCallback`을 통한 불필요한 재계산 방지
- **부분 렌더링**: 애니메이션 요소의 분리 및 독립적 렌더링
- **가상화**: 리더보드의 큰 목록에 가상화 적용

### 2. 데이터 로딩 전략

- **정적 생성**: 앱 셸과 주요 UI 요소의 정적 생성
- **점진적 로딩**: 핵심 기능 먼저 로드 후 추가 기능 지연 로드
- **데이터 캐싱**: Zustand persist를 통한 로컬 스토리지 활용

### 3. 애니메이션 최적화

- **하드웨어 가속**: CSS 트랜스폼 및 GPU 가속 속성 활용
- **애니메이션 분리**: 독립적인 애니메이션 컴포넌트로 분리
- **타이밍 제어**: 애니메이션 타이밍 및 이징 함수 최적화

```typescript
// 성능을 위한 애니메이션 최적화 예시
const buttonVariants = {
  initial: { scale: 1 },
  pressed: { scale: 0.95 },
  tilt: (info: { x: number; y: number }) => ({
    rotateX: info.y * 20,
    rotateY: -info.x * 20,
    transition: { type: 'spring', stiffness: 400, damping: 15 }
  })
}

// 컴포넌트에서 활용
;<motion.div
  ref={buttonRef}
  variants={buttonVariants}
  initial="initial"
  animate={isPressed ? 'pressed' : 'initial'}
  custom={{ x: tiltX, y: tiltY }}
  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
  className="h-48 w-48 bg-blue-500 rounded-full"
  onClick={handleClick}
>
  <Image src="/images/topu.png" alt="Topu" width={160} height={160} />
</motion.div>
```

## 데모 및 스크린샷

<div align="center">
  <img src="./assets/demo-collage.png" alt="App Demo" width="800"/>
</div>

## 설치 및 개발 가이드

### 환경 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/fragtopu-telegram-miniapp.git
cd fragtopu-telegram-miniapp

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일 편집

# 개발 서버 실행
pnpm dev
```

### 배포

```bash
# 정적 사이트 빌드
pnpm build

# Vercel 배포
pnpm dlx vercel deploy --prod
```

### Supabase 설정

1. Supabase 프로젝트 생성
2. 데이터베이스 스키마 설정
3. Edge Functions 배포

## 기여 및 피드백

이 프로젝트에 기여하거나 피드백을 제공하고 싶으시면 이슈를 열거나 PR을 제출해 주세요. 모든 기여와 제안은 환영합니다!

## 라이선스

MIT © FragTopu Team

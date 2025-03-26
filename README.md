# FragTopu: Telegram Mini App

<div align="center">
  <img src="https://github.com/user-attachments/assets/1649eb0f-3572-492b-a2d2-ce2153012158" alt="FragTopu Telegram Mini App"/>
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
  <img width="391" alt="Image" src="https://github.com/user-attachments/assets/3b6c0f18-7a08-4701-920b-52a325d91904" />
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

<div align="center" style="display: flex; gap: 10px;">
  <img width="386" alt="Image" src="https://github.com/user-attachments/assets/4f672204-d24c-44b3-a981-16d95448c13e" />
  <img width="387" alt="Image" src="https://github.com/user-attachments/assets/549dd1d8-1c5c-4164-9da1-cc74ff6eda53" />
  <img width="398" alt="Image" src="https://github.com/user-attachments/assets/bac64f6d-894f-4dc5-b26c-1fa30d16182d" />
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
  <img width="394" alt="Image" src="https://github.com/user-attachments/assets/97bff17e-a4f0-47be-8dcf-08d4dff1e623" />
</div>

- **멀티 뷰 리더보드**

  - 글로벌 랭킹 및 친구 필터링
  - 카테고리별 점수 확인 (전체, 클리커, 베팅)

- **친구 추천 시스템**
  - 고유 추천 코드 및 링크 생성
  - 친구 초대 시 보상 획득
  - 추천 통계 및 추적

### 4. 과제 및 보상 시스템

<div align="center" style="display: flex; gap: 10px;">
  <img width="388" alt="Image" src="https://github.com/user-attachments/assets/e781d1f2-9576-4461-a1ce-e4dbe59b2f60" />
  <img width="382" alt="Image" src="https://github.com/user-attachments/assets/5cdbd22d-1c7f-4728-b1e4-174880aaf541" />
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

## Architecture

### Project Architecture

<div align="center">
  <img src="https://github.com/user-attachments/assets/d067987c-1191-4618-9dfb-69032a503f28" alt="System Architecture"/>
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
  <img src="https://github.com/user-attachments/assets/8ebecd1a-1376-426d-8073-1c10d1ece805" alt="Data Flow"/>
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

### 1. Supabase: 완전한 서버리스 백엔드 솔루션

**Supabase 개요**:
Supabase는 Firebase의 오픈소스 대안으로, PostgreSQL 데이터베이스를 기반으로 하는 완전한 서버리스 백엔드 솔루션입니다. 백엔드 개발을 위한 다양한 툴과 서비스를 제공하며, API를 자동으로 생성하여 프론트엔드와의 통합을 간소화합니다.

**주요 특징**:

- **PostgreSQL 데이터베이스**: 강력한 관계형 데이터베이스를 기반으로 복잡한 쿼리와 관계 모델링 지원
- **실시간 구독**: 웹소켓을 통한 데이터 변경 사항 실시간 수신
- **인증 및 권한 관리**: 다양한 소셜 로그인 옵션 및 세밀한 권한 제어 시스템
- **스토리지**: 파일 저장 및 관리를 위한 통합 솔루션
- **Edge Functions**: 서버리스 함수 실행 환경
- **클라이언트 라이브러리**: 다양한 프로그래밍 언어 지원

**도입 이유**:

- Next.js 정적 내보내기와의 호환성: 서버 컴포넌트 없이도 강력한 백엔드 기능 제공
- 개발 속도 향상: 자동 생성된 API와 SDK로 빠른 개발
- 확장성: 사용자 증가에 따른 자동 스케일링
- 비용 효율성: 사용량 기반 요금제로 초기 비용 절감

**구현 방식**:

```typescript
// Supabase 클라이언트 초기화
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 테이블 조회 예시
async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, total_score, clicker_score, betting_score')
    .order('total_score', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data
}
```

**장점**:

- 완전한 백엔드 솔루션으로 별도 서버 구축 불필요
- PostgreSQL의 강력한 기능과 확장성
- 자동 생성된 API로 개발 속도 향상
- 실시간 기능 기본 지원
- 오픈소스 기반으로 커스터마이징 가능

**도전과 해결책**:

- **사용자 인증**: Telegram 사용자 정보를 Supabase 사용자와 연결하기 위해 Edge Function 활용
- **데이터 동기화**: 클라이언트 상태와 서버 데이터 간의 일관성을 유지하기 위한 최적화 패턴 구현
- **실시간 업데이트**: 리더보드와 베팅 결과에 대한 즉각적인 피드백을 위한 구독 메커니즘 구현

### 2. Supabase Edge Functions: 서버리스 컴퓨팅의 진화

**Edge Functions 개요**:
Supabase Edge Functions는 Deno 런타임 환경을 기반으로 하는 서버리스 함수로, 전 세계 Edge 네트워크에서 실행되어 지연 시간을 최소화하고 성능을 최적화합니다. AWS Lambda나 Vercel Edge Functions와 유사하지만, Supabase 플랫폼과 긴밀하게 통합되어 있습니다.

**주요 특징**:

- **Deno 기반**: 현대적이고 안전한 TypeScript/JavaScript 런타임
- **전역 배포**: 사용자와 가까운 위치에서 함수 실행
- **TypeScript 지원**: 타입 안전성이 보장된 개발 경험
- **환경 변수 관리**: 보안 키 및 설정 관리
- **Supabase 서비스 통합**: 데이터베이스 및 스토리지와의 원활한 연동

**도입 이유**:

- 정적 웹 애플리케이션의 제한 극복: 클라이언트에서 실행할 수 없는 보안 작업 처리
- 서버 의존성 없이 API 기능 제공: 전체 백엔드 서버 없이도 필요한 API 엔드포인트 구현
- 민감한 작업 처리: 토큰 검증, 외부 API 호출 등 클라이언트에 노출되면 안 되는 작업 수행
- 확장성 및 성능: 전역 분산 실행으로 지연 시간 최소화 및 자동 스케일링

**구현 방식**:

```typescript
// Edge Function 예시: Telegram 사용자 검증
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { user } = await req.json()

    // 사용자 데이터 검증
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'Invalid user data' }), { status: 400 })
    }

    // Supabase 클라이언트 초기화 (서비스 롤 키 사용)
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 데이터베이스 조회 및 처리
    const { data: existingUser } = await supabase.from('users').select('*').eq('id', user.id.toString()).single()

    // 사용자 데이터 처리 로직
    let userData
    if (existingUser) {
      // 기존 사용자 업데이트
      userData = existingUser
    } else {
      // 새 사용자 생성
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          id: user.id.toString(),
          username: user.username || `user${user.id}`,
          first_name: user.first_name,
          last_name: user.last_name,
          language_code: user.language_code,
          is_premium: user.is_premium || false,
          referral_code: generateReferralCode(user.id)
        })
        .select()
        .single()

      userData = newUser
    }

    return new Response(JSON.stringify({ success: true, user: userData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

// 고유한 참조 코드 생성 함수
function generateReferralCode(userId: number): string {
  return `${userId.toString(36)}${Math.random().toString(36).substring(2, 5)}`.toUpperCase()
}
```

**AWS Lambda, Firebase Functions와의 비교**:

- **AWS Lambda**: 더 많은 런타임 옵션을 제공하지만 설정이 복잡하고 콜드 스타트 지연이 있음
- **Firebase Functions**: Node.js 환경에 제한되고 더 긴 콜드 스타트 시간
- **Supabase Edge Functions**: Deno 기반으로 더 빠른 콜드 스타트, TypeScript 기본 지원, Edge 네트워크 활용으로 지연 시간 감소

**장점**:

- 클라이언트 측 코드에서 보안 키를 노출하지 않고 안전한 작업 수행
- Supabase 서비스와의 원활한 통합
- Edge 네트워크를 활용한 낮은 지연 시간
- Deno 런타임의 보안 및 성능 이점
- 자동 스케일링으로 운영 부담 감소

**도전과 해결책**:

- **개발 환경 구성**: Supabase CLI를 활용한 로컬 개발 및 테스트 환경 설정
- **디버깅 제한**: 클라우드 환경에서의 디버깅 한계를 로깅 및 모니터링으로 극복
- **콜드 스타트**: 첫 실행 시 지연 시간을 최소화하기 위한 코드 최적화
- **환경 변수 관리**: 보안 키 및 설정의 안전한 관리를 위한 Supabase 대시보드 활용

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

### 4. Telegram Mini App UX/UI 최적화

**도전**: 제한된 Telegram 미니앱 환경에서 네이티브 앱과 같은 사용자 경험 제공

**해결책**:

- **Telegram SDK 활용**: 플랫폼 특화 기능 및 UI 컴포넌트 통합
- **반응형 디자인**: 다양한 기기 및 화면 크기 지원을 위한 적응형 레이아웃
- **애니메이션 최적화**: Framer Motion을 활용한 부드러운 전환 효과

**최적화 전략**:

- **성능 우선 디자인**: 60fps 애니메이션 및 빠른 응답성 유지
- **점진적 향상**: 기본 기능부터 보장 후 고급 기능 추가
- **오프라인 지원**: 로컬 상태로 오프라인 사용성 개선

```typescript
// Telegram Mini App 특화 최적화 예시: 앱 구성과 이벤트 처리
function setupTelegramApp() {
  // 뒤로가기 버튼 처리 및 메인 버튼 설정
  useEffect(() => {
    // 백 버튼 설정
    const handleBackButton = () => {
      if (currentView !== 'home') {
        setCurrentView('home')
        return true // 이벤트 처리됨
      }
      return false // 기본 동작 수행
    }

    // 메인 버튼 설정
    miniApp.enableClosingConfirmation()
    backButton.onClick(handleBackButton)

    // 테마 변경 감지
    const handleThemeChange = () => {
      setIsDarkMode(miniApp.isDark)
    }

    miniApp.onEvent('themeChanged', handleThemeChange)

    return () => {
      backButton.offClick(handleBackButton)
      miniApp.offEvent('themeChanged', handleThemeChange)
    }
  }, [currentView, setCurrentView])

  // 하드웨어 가속 및 성능 최적화 요소
  return (
    <div className="app-container" style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}>
      {/* 앱 컴포넌트 */}
    </div>
  )
}
```

**Telegram 플랫폼 특화 최적화**:

- **웹앱 시작 파라미터 처리**: 초대 코드, 딥링크 등의 시작 파라미터 처리
- **해피패스 최적화**: 주요 사용자 흐름의 마찰 최소화
- **장치별 UI 조정**: iOS/Android 플랫폼 감지 및 특화 UI 제공

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

### Deploy

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

## Contribution

이 프로젝트에 기여하거나 피드백을 제공하고 싶으시면 이슈를 열거나 PR을 제출해 주세요. 모든 기여와 제안은 환영합니다!

## License

MIT © FragTopu Team

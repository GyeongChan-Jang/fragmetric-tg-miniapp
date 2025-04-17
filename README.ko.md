# FragTopu: Telegram Mini App

🌐 Available in: [English](README.md)

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

## 아키텍처

### 프로젝트 아키텍처

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
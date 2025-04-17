# FragTopu: Telegram Mini App

🌐 Available in: [한국어 (Korean)](README.ko.md)

<div align="center">
  <img src="https://github.com/user-attachments/assets/1649eb0f-3572-492b-a2d2-ce2153012158" alt="FragTopu Telegram Mini App"/>
  <p><em>A Telegram Mini App platform offering gaming and social experiences</em></p>
</div>

## Project Overview

FragTopu is a web application that provides gaming and social experiences running on the Telegram Mini App platform. Users can play clicker games, participate in SOL price prediction betting, and compete with friends through leaderboards. All features utilize Telegram's user authentication and are implemented with a serverless backend through Supabase.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Implementation Details](#implementation-details)
- [Technical Challenges and Solutions](#technical-challenges-and-solutions)
- [Performance Optimization](#performance-optimization)
- [Demo and Screenshots](#demo-and-screenshots)
- [Installation and Development Guide](#installation-and-development-guide)

## Key Features

### 1. Clicker Game

<div align="center">
  <img width="391" alt="Image" src="https://github.com/user-attachments/assets/3b6c0f18-7a08-4701-920b-52a325d91904" />
</div>

- **Interactive Clicker Mechanism**

  - Button animations with 3D tilt effects
  - Score display at click points (+1, +2)
  - Boost system for additional points during limited time

- **Progression System**
  - Celebration effects on milestone achievements
  - Click statistics and score tracking
  - Various rank systems (Bronze, Silver, Gold, etc.)

### 2. SOL Price Prediction Betting

<div align="center" style="display: flex; gap: 10px;">
  <img width="386" alt="Image" src="https://github.com/user-attachments/assets/4f672204-d24c-44b3-a981-16d95448c13e" />
  <img width="387" alt="Image" src="https://github.com/user-attachments/assets/549dd1d8-1c5c-4164-9da1-cc74ff6eda53" />
  <img width="398" alt="Image" src="https://github.com/user-attachments/assets/bac64f6d-894f-4dc5-b26c-1fa30d16182d" />
</div>

- **Real-time Chart System**

  - Real-time SOL/USDT price charts using Binance API
  - Support for various timeframes (1m, 5m, 15m, 1h, 4h, 1d)
  - Candlestick charts for price trend visualization

- **Betting Mechanism**
  - Prediction betting on price movement (UP or DOWN)
  - Score reward system based on results
  - Result announcement animations and visual feedback
  - Daily betting limits for balanced gameplay

### 3. Leaderboard and Social Features

<div align="center">
  <img width="394" alt="Image" src="https://github.com/user-attachments/assets/97bff17e-a4f0-47be-8dcf-08d4dff1e623" />
</div>

- **Multi-view Leaderboard**

  - Global rankings and friend filtering
  - Score checking by category (total, clicker, betting)

- **Friend Referral System**
  - Unique referral code and link generation
  - Rewards for inviting friends
  - Referral statistics and tracking

### 4. Tasks and Reward System

<div align="center" style="display: flex; gap: 10px;">
  <img width="388" alt="Image" src="https://github.com/user-attachments/assets/e781d1f2-9576-4461-a1ce-e4dbe59b2f60" />
  <img width="382" alt="Image" src="https://github.com/user-attachments/assets/5cdbd22d-1c7f-4728-b1e4-174880aaf541" />
</div>

- **Various Task Types**
  - Daily tasks: Activity-based tasks that reset daily
  - Social tasks: Tasks related to friend invitations and social interactions
  - One-time tasks: Tasks related to major achievement milestones
- **Reward System**
  - Score rewards for completed tasks
  - Progress tracking and visualization
  - Record keeping of completed tasks

## Tech Stack

### Frontend

- **Next.js 14**: File-based routing, Static Export
- **TypeScript**: Type safety and improved development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: High-performance animation library
- **Lightweight Charts**: Trading chart visualization

### State Management and Data Flow

- **Zustand**: Lightweight state management library
- **Supabase Client**: Database interaction

### Backend

- **Supabase**: Serverless backend and database
- **Edge Functions**: Serverless function execution environment
- **PostgreSQL**: Relational database

### Integrations and APIs

- **Telegram Mini Apps SDK**: Telegram platform integration
- **TON Connect**: TON blockchain wallet connection
- **Binance API**: Cryptocurrency price data

## Architecture

### Project Architecture

<div align="center">
  <img src="https://github.com/user-attachments/assets/d067987c-1191-4618-9dfb-69032a503f28" alt="System Architecture"/>
</div>

FragTopu follows a client-serverless architecture:

1. **Static Next.js Application**

   - Statically generated web application (SSG)
   - Global deployment through CDN for fast loading
   - Client-side data fetching and state management

2. **Supabase Serverless Backend**

   - PostgreSQL database: Storing user, game, and leaderboard data
   - Edge Functions: Telegram authentication, security handling, external API integration
   - Real-time subscriptions: Live updates for leaderboards and betting results

3. **External Integrations**
   - Telegram Bot API: User authentication and mini-app entry point
   - Binance API: Cryptocurrency price data
   - TON Wallet: Blockchain wallet connection functionality (extensibility)

### Data Flow

<div align="center">
  <img src="https://github.com/user-attachments/assets/8ebecd1a-1376-426d-8073-1c10d1ece805" alt="Data Flow"/>
</div>

1. **User Authentication Flow**

   ```mermaid
   sequenceDiagram
       participant User
       participant Telegram
       participant MiniApp
       participant Edge
       participant Supabase

       User->>Telegram: Execute bot/mini-app
       Telegram->>MiniApp: Provide initData
       MiniApp->>Edge: Send initData
       Edge->>Edge: HMAC verification
       Edge->>Supabase: Query/create user
       Supabase->>Edge: User information
       Edge->>MiniApp: Authentication result
       MiniApp->>User: Display app UI
   ```

2. **State Management Architecture**
   - Modular state management through Zustand stores
   - Local storage for persistence layer
   - Server synchronization via Supabase client

## Implementation Details

### 1. Game Mechanisms

#### Clicker Game

```typescript
// Click handling and 3D tilt effect
const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  // Calculate click point and apply animation
  const rect = buttonRef.current?.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // Calculate 3D tilt effect
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const offsetX = (x - centerX) / centerX
  const offsetY = (y - centerY) / centerY

  // Natural tilt with spring animation
  springTiltX.set(-offsetY * 20)
  springTiltY.set(offsetX * 20)

  // Score calculation and animation
  const boostAmount = boost > 0 ? 1 : 0
  const points = 1 + boostAmount
  updateClickerScore(points)

  // Score display animation
  setClickPoints((prev) => [...prev, { id: nextId, x, y, value: points }])
}
```

#### SOL Betting Game

```typescript
// Bet result processing and reward calculation
const processBetResult = useCallback(() => {
  if (!currentBet || !currentPrice) return

  // Win/loss determination logic
  const startPrice = currentBet.sol_price_start
  const endPrice = currentPrice
  const betType = currentBet.type
  const result = betType === 'UP' ? (endPrice > startPrice ? 'WIN' : 'LOSE') : endPrice < startPrice ? 'WIN' : 'LOSE'

  // Reward calculation
  const scoreEarned = result === 'WIN' ? 10 : 0

  // Update result and display modal
  setBetResult(result)
  setResultData({
    startPrice,
    endPrice,
    betType,
    scoreEarned: result === 'WIN' ? 10 : 0
  })

  // Database update
  updateBetResult(currentBet.id, endPrice, result, scoreEarned)
  setShowModal(true)
}, [currentBet, currentPrice, updateBetResult])
```

### 2. Telegram Integration

#### Mini App Initialization

```typescript
// Root.tsx - Telegram mini app initialization
function RootInner({ children }: PropsWithChildren) {
  // Telegram environment mocking (for development)
  useTelegramMock()

  // Launch parameters and debug settings
  const lp = useLaunchParams()
  const debug = process.env.NODE_ENV === 'development' || lp.startParam === 'debug'

  // Library initialization
  useClientOnce(() => {
    init(debug)
  })

  // Telegram theme and language settings
  const isDark = useSignal(miniApp.isDark)
  const initDataUser = useSignal(initData.user)

  useEffect(() => {
    initDataUser && setLocale(initDataUser.languageCode)
  }, [initDataUser])

  // TON Connect and UI theme application
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

#### User Authentication

```typescript
// useTelegramAuth.ts - Telegram user authentication hook
export function useTelegramAuth(): TelegramAuthHook {
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, setUser, initUser } = useUserStore()

  // Get user info from Telegram SDK
  const initDataUser = useSignal(initData.user)

  // Authentication initialization function
  const initTelegramAuth = useCallback(async () => {
    setIsLoading(true)

    try {
      if (initDataUser) {
        // User verification request to Edge Function
        const { data, error } = await supabase.functions.invoke('verify-telegram', {
          body: { user: initDataUser }
        })

        if (error || !data.success) throw new Error('User verification failed')

        // Store user info on successful verification
        setUser(data.user as User)
        setIsAuthenticated(true)
        localStorage.setItem('user-id', data.user.id)
      } else {
        // Check for local user when SDK data not available
        const storedUserId = localStorage.getItem('user-id')

        if (storedUserId && storedUserId !== 'local-user') {
          // Query existing user info
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
      setError(err instanceof Error ? err.message : 'Authentication failed')
      initUser()
    } finally {
      setIsLoading(false)
    }
  }, [initDataUser, setUser, initUser])

  return { isLoading, error, user, isAuthenticated, initTelegramAuth }
}
```

### 3. State Management and Data Persistence

```typescript
// userStore.ts - Zustand store implementation
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      boost: MAX_BOOST,
      lastBoostRefresh: null,

      // User setup function
      setUser: (user) => set({ user }),

      // Score update function
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

          // Asynchronously update to Supabase
          get().saveUserToSupabase()

          return { user: updatedUser }
        }),

      // Supabase synchronization function
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
              // ...other fields
            })
            .eq('id', user.id)
        } catch (err) {
          console.error('Error saving user to Supabase:', err)
        }
      }

      // Other states and functions...
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

## Technical Challenges and Solutions

### 1. Supabase: Complete Serverless Backend Solution

**Supabase Overview**:
Supabase is an open-source alternative to Firebase, based on a PostgreSQL database, providing a complete serverless backend solution. It offers various tools and services for backend development and automatically generates APIs to simplify integration with the frontend.

**Key Features**:

- **PostgreSQL Database**: Powerful relational database supporting complex queries and relationship modeling
- **Real-time Subscriptions**: Real-time data change notifications via websockets
- **Authentication and Authorization**: Various social login options and granular permission control system
- **Storage**: Integrated solution for file storage and management
- **Edge Functions**: Serverless function execution environment
- **Client Libraries**: Support for various programming languages

**Reasons for Adoption**:

- Compatibility with Next.js static export: Provides powerful backend features even without server components
- Accelerated development: Fast development with auto-generated APIs and SDKs
- Scalability: Automatic scaling with user growth
- Cost-efficiency: Usage-based pricing model reduces initial costs

**Implementation Method**:

```typescript
// Supabase client initialization
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Table query example
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

**Advantages**:

- Complete backend solution without separate server construction
- PostgreSQL's powerful features and scalability
- Faster development with auto-generated APIs
- Built-in real-time functionality
- Customizable with open-source foundation

**Challenges and Solutions**:

- **User Authentication**: Using Edge Functions to connect Telegram user info with Supabase users
- **Data Synchronization**: Implementing optimization patterns to maintain consistency between client state and server data
- **Real-time Updates**: Implementing subscription mechanisms for immediate feedback on leaderboards and betting results

### 2. Supabase Edge Functions: Evolution of Serverless Computing

**Edge Functions Overview**:
Supabase Edge Functions are serverless functions based on the Deno runtime environment, executed on a global Edge network to minimize latency and optimize performance. They're similar to AWS Lambda or Vercel Edge Functions but are tightly integrated with the Supabase platform.

**Key Features**:

- **Deno-based**: Modern and secure TypeScript/JavaScript runtime
- **Global Deployment**: Function execution close to users
- **TypeScript Support**: Type-safe development experience
- **Environment Variable Management**: Security key and configuration management
- **Supabase Service Integration**: Seamless integration with database and storage

**Reasons for Adoption**:

- Overcoming static web application limitations: Handling security tasks that cannot be executed on the client
- Providing API functionality without server dependencies: Implementing necessary API endpoints without a full backend server
- Handling sensitive operations: Token validation, external API calls, etc., that should not be exposed to clients
- Scalability and performance: Minimizing latency with global distributed execution and automatic scaling

**Implementation Method**:

```typescript
// Edge Function Example: Telegram user verification
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { user } = await req.json()

    // User data validation
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'Invalid user data' }), { status: 400 })
    }

    // Supabase client initialization (using service role key)
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Database query and processing
    const { data: existingUser } = await supabase.from('users').select('*').eq('id', user.id.toString()).single()

    // User data processing logic
    let userData
    if (existingUser) {
      // Update existing user
      userData = existingUser
    } else {
      // Create new user
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

// Function to generate a unique referral code
function generateReferralCode(userId: number): string {
  return `${userId.toString(36)}${Math.random().toString(36).substring(2, 5)}`.toUpperCase()
}
```

**Comparison with AWS Lambda, Firebase Functions**:

- **AWS Lambda**: Provides more runtime options but is complex to set up and has cold start delays
- **Firebase Functions**: Limited to Node.js environment and longer cold start times
- **Supabase Edge Functions**: Deno-based with faster cold start, built-in TypeScript support, reduced latency using Edge network

**Advantages**:

- Performing secure operations without exposing security keys in client-side code
- Seamless integration with Supabase services
- Low latency using Edge network
- Security and performance benefits of Deno runtime
- Reduced operational burden with automatic scaling

**Challenges and Solutions**:

- **Development Environment Setup**: Local development and testing environment setup using Supabase CLI
- **Debugging Limitations**: Overcoming cloud environment debugging limitations with logging and monitoring
- **Cold Start**: Code optimization to minimize latency on first execution
- **Environment Variable Management**: Using Supabase dashboard for secure management of security keys and settings

### 3. Betting Game Real-time Data

**Challenge**: Implementing a betting game using real-time price data and processing results

**Solution**:

- **Binance API Utilization**: Querying real-time SOL/USDT price data
- **Caching and Polling**: Implementing strategies for efficient API calls
- **Fair Game Logic**: Clear rules and transparent result calculation

```typescript
// Fetching SOL price data and updating chart
const fetchCandleData = useCallback(async () => {
  if (!isChartReady || !candleSeriesRef.current) return

  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=${timeFrame}&limit=100`)
    const data = await response.json()

    // Data formatting and chart update
    if (data && data.length > 0) {
      const formattedData = data.map((item) => ({
        time: (item[0] / 1000) as Time,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4])
      }))

      candleSeriesRef.current.setData(formattedData)

      // Current price update
      const lastPrice = parseFloat(data[data.length - 1][4])
      setCurrentPrice(lastPrice)
    }
  } catch (error) {
    console.error('Error fetching candle data:', error)
  }
}, [timeFrame, isChartReady, setCurrentPrice])

// Setting periodic updates
useEffect(() => {
  // Initial data load
  fetchCandleData()

  // Update every 10 seconds
  const interval = setInterval(fetchCandleData, 10000)
  return () => clearInterval(interval)
}, [fetchCandleData])
```

### 4. Telegram Mini App UX/UI Optimization

**Challenge**: Providing a native app-like user experience in a limited Telegram mini-app environment

**Solution**:

- **Telegram SDK Utilization**: Integration of platform-specific features and UI components
- **Responsive Design**: Adaptive layouts for various devices and screen sizes
- **Animation Optimization**: Smooth transition effects using Framer Motion

**Optimization Strategy**:

- **Performance-first Design**: Maintaining 60fps animations and fast responsiveness
- **Progressive Enhancement**: Ensuring basic functionality first, then adding advanced features
- **Offline Support**: Improving offline usability with local state

```typescript
// Telegram Mini App specific optimization example: App configuration and event handling
function setupTelegramApp() {
  // Back button handling and main button setup
  useEffect(() => {
    // Back button setup
    const handleBackButton = () => {
      if (currentView !== 'home') {
        setCurrentView('home')
        return true // Event handled
      }
      return false // Perform default behavior
    }

    // Main button setup
    miniApp.enableClosingConfirmation()
    backButton.onClick(handleBackButton)

    // Theme change detection
    const handleThemeChange = () => {
      setIsDarkMode(miniApp.isDark)
    }

    miniApp.onEvent('themeChanged', handleThemeChange)

    return () => {
      backButton.offClick(handleBackButton)
      miniApp.offEvent('themeChanged', handleThemeChange)
    }
  }, [currentView, setCurrentView])

  // Hardware acceleration and performance optimization elements
  return (
    <div className="app-container" style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}>
      {/* App components */}
    </div>
  )
}
```

**Telegram Platform-specific Optimizations**:

- **Web App Start Parameter Handling**: Handling invitation codes, deep links, and other start parameters
- **Happy Path Optimization**: Minimizing friction in main user flows
- **Device-specific UI Adjustments**: Detecting and providing specialized UI for iOS/Android platforms

## Performance Optimization

### 1. Rendering Performance

- **Memoization**: Preventing unnecessary recalculations through `useMemo` and `useCallback`
- **Partial Rendering**: Separating and independently rendering animation elements
- **Virtualization**: Applying virtualization to large lists in leaderboards

### 2. Data Loading Strategy

- **Static Generation**: Static generation of app shell and main UI elements
- **Progressive Loading**: Loading core functionality first, then lazy-loading additional features
- **Data Caching**: Utilizing local storage through Zustand persist

### 3. Animation Optimization

- **Hardware Acceleration**: Utilizing CSS transforms and GPU-accelerated properties
- **Animation Separation**: Separating into independent animation components
- **Timing Control**: Optimizing animation timing and easing functions

```typescript
// Animation optimization example for performance
const buttonVariants = {
  initial: { scale: 1 },
  pressed: { scale: 0.95 },
  tilt: (info: { x: number; y: number }) => ({
    rotateX: info.y * 20,
    rotateY: -info.x * 20,
    transition: { type: 'spring', stiffness: 400, damping: 15 }
  })
}

// Used in component
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

## Demo and Screenshots

<div align="center">
  <img src="./assets/demo-collage.png" alt="App Demo" width="800"/>
</div>

## Installation and Development Guide

### Environment Setup

```bash
# Clone repository
git clone https://github.com/yourusername/fragtopu-telegram-miniapp.git
cd fragtopu-telegram-miniapp

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local file

# Run development server
pnpm dev
```

### Deploy

```bash
# Build static site
pnpm build

# Vercel deployment
pnpm dlx vercel deploy --prod
```

### Supabase Setup

1. Create Supabase project
2. Set up database schema
3. Deploy Edge Functions

## Contribution

If you'd like to contribute to this project or provide feedback, please open an issue or submit a PR. All contributions and suggestions are welcome!

## License

MIT © FragTopu Team

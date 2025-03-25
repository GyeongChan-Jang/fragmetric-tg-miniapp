# Fragmetric Telegram Mini App

Fragmetric Telegram Mini App은 텔레그램 미니앱 플랫폼을 위한 게임과 기능을 제공하는 프로젝트입니다.

## 주요 기능

- 클리커 게임: 버튼을 탭하여 점수 획득
- 베팅 시스템: SOL 가격 변동 예측 게임
- 리더보드: 글로벌 및 친구 랭킹 시스템
- 계정 관리: 사용자 정보 및 추천 시스템
- Telegram 사용자 인증: 텔레그램 데이터를 사용한 서버 측 검증

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- Framer Motion (애니메이션)
- Supabase (데이터베이스 및 Edge Functions)
- Telegram WebApp API

## 환경 변수 설정

이 프로젝트는 다양한 환경 변수 파일을 사용합니다:

### 1. 앱 환경 변수 (`.env.local`)

클라이언트 및 서버 측에서 사용하는 환경 변수입니다. `.env.local.example` 파일을 복사하여 생성합니다:

```bash
cp .env.local.example .env.local
```

필요한 변수:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키 (공개)
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`: Telegram 봇 사용자명
- `NEXT_PUBLIC_DEV_SERVER_URL`: 개발 서버 URL (로컬 개발 시 필요)

### 2. Supabase Edge Function 환경 변수

Supabase Edge Function에서 사용하는 환경 변수입니다. Supabase CLI를 사용하여 설정합니다:

```bash
# 주의: SUPABASE_ 접두사는 예약되어 있으므로 사용하지 마세요
supabase secrets set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
supabase secrets set SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set PROJECT_URL=your_project_url
```

## Supabase 연동 가이드

이 프로젝트는 Supabase를 데이터베이스로 사용합니다. 다음은 Supabase 설정 및 연동 방법입니다.

### 1. 필요한 테이블

Supabase에서 다음 테이블을 생성해야 합니다:

- `users`: 사용자 정보 테이블

  - id (primary key)
  - username (text, nullable)
  - first_name (text, nullable)
  - last_name (text, nullable)
  - created_at (timestamp with timezone)
  - clicker_score (integer)
  - betting_score (integer)
  - total_score (integer)
  - daily_bets (integer)
  - last_bet_reset (timestamp, nullable)
  - last_click_time (timestamp, nullable)
  - referrer_id (text, foreign key, nullable)
  - referral_code (text, unique)
  - is_telegram_user (boolean, default: false)

- `bets`: 베팅 정보 테이블

  - id (primary key)
  - user_id (text, foreign key)
  - amount (integer)
  - type (text, 'UP' or 'DOWN')
  - created_at (timestamp with timezone)
  - result (text, 'WIN', 'LOSE', or 'PENDING')
  - score_earned (integer)
  - sol_price_start (numeric)
  - sol_price_end (numeric, nullable)

- `tasks`: 태스크 정보 테이블

  - id (primary key)
  - title (text)
  - description (text)
  - reward (integer)
  - task_type (text)

- `user_tasks`: 사용자와 태스크 간의 관계 테이블
  - id (primary key)
  - user_id (text, foreign key)
  - task_id (uuid, foreign key)
  - completed (boolean)
  - completed_at (timestamp, nullable)

### 2. Edge Function 설정

Telegram 인증을 위한 Edge Function을 설정해야 합니다:

1. Supabase CLI 설치:

```bash
brew install supabase/tap/supabase
```

2. 프로젝트 연결:

```bash
supabase login
supabase link --project-ref your_project_reference_id
```

3. Edge Function 배포:

```bash
supabase functions deploy verify-telegram
```

### 3. 사용 방법

Supabase 클라이언트는 `src/lib/supabase.ts`에 설정되어 있으며, 코드 내에서 다음과 같이 사용할 수 있습니다:

```typescript
import { supabase } from '@/lib/supabase'

// 데이터 조회 예시
const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
```

## Telegram 봇 및 미니앱 설정

1. [@BotFather](https://t.me/botfather)에서 봇 생성
2. `/newapp` 명령으로 미니앱 생성
3. 아래 형식의 URL을 웹 앱 URL로 설정:
   ```
   https://your-domain.com/telegram-web-app.html
   ```
4. 필요한 경우 봇 토큰 확인 (/token 명령)

## 개발 시작하기

1. 의존성 설치:

   ```
   pnpm install
   ```

2. 환경 변수 설정:

   ```
   cp .env.local.example .env.local
   ```

   그리고 실제 값으로 수정

3. 개발 서버 실행:

   ```
   pnpm dev
   ```

4. HTTPS 개발 서버 실행 (Telegram 미니앱 테스트용):

   ```
   pnpm dev:https
   ```

5. 빌드:
   ```
   pnpm build
   ```

## 정적 내보내기

이 프로젝트는 정적 사이트로 내보내기를 지원합니다. `next.config.mjs` 파일에 다음 설정이 포함되어 있습니다:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)를 따릅니다.

# Telegram Mini Apps Next.js Template

This template demonstrates how developers can implement a web application on the
Telegram Mini Apps platform using the following technologies and libraries:

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [@telegram-apps SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)

> The template was created using [pnpm](https://pnpm.io/). Therefore, it is
> required to use it for this project as well. Using other package managers, you
> will receive a corresponding error.

## Install Dependencies

If you have just cloned this template, you should install the project
dependencies using the command:

```Bash
pnpm install
```

## Scripts

This project contains the following scripts:

- `dev`. Runs the application in development mode.
- `dev:https`. Runs the application in development mode using self-signed SSL
  certificate.
- `build`. Builds the application for production.
- `start`. Starts the Next.js server in production mode.
- `lint`. Runs [eslint](https://eslint.org/) to ensure the code quality meets
  the required
  standards.

To run a script, use the `pnpm run` command:

```Bash
pnpm run {script}
# Example: pnpm run build
```

## Create Bot and Mini App

Before you start, make sure you have already created a Telegram Bot. Here is
a [comprehensive guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)
on how to do it.

## Run

Although Mini Apps are designed to be opened
within [Telegram applications](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
you can still develop and test them outside of Telegram during the development
process.

To run the application in the development mode, use the `dev` script:

```bash
pnpm run dev
```

After this, you will see a similar message in your terminal:

```bash
▲ Next.js 14.2.3
- Local:        http://localhost:3000

✓ Starting...
✓ Ready in 2.9s
```

To view the application, you need to open the `Local`
link (`http://localhost:3000` in this example) in your browser.

It is important to note that some libraries in this template, such as
`@telegram-apps/sdk`, are not intended for use outside of Telegram.

Nevertheless, they appear to function properly. This is because the
`src/hooks/useTelegramMock.ts` file, which is imported in the application's
`Root` component, employs the `mockTelegramEnv` function to simulate the
Telegram environment. This trick convinces the application that it is
running in a Telegram-based environment. Therefore, be cautious not to use this
function in production mode unless you fully understand its implications.

### Run Inside Telegram

Although it is possible to run the application outside of Telegram, it is
recommended to develop it within Telegram for the most accurate representation
of its real-world functionality.

To run the application inside Telegram, [@BotFather](https://t.me/botfather)
requires an HTTPS link.

This template already provides a solution.

To retrieve a link with the HTTPS protocol, consider using the `dev:https`
script:

```bash
$ pnpm run dev:https

▲ Next.js 14.2.3
- Local:        https://localhost:3000

✓ Starting...
✓ Ready in 2.4s
```

Visiting the `Local` link (`https://localhost:3000` in this example) in your
browser, you will see the following warning:

![SSL Warning](assets/ssl-warning.png)

This browser warning is normal and can be safely ignored as long as the site is
secure. Click the `Proceed to localhost (unsafe)` button to continue and view
the application.

Once the application is displayed correctly, submit the
link `https://127.0.0.1:3000` (`https://localhost:3000` is considered as invalid
by BotFather) as the Mini App link to [@BotFather](https://t.me/botfather).
Then, navigate to [https://web.telegram.org/k/](https://web.telegram.org/k/),
find your bot, and launch the Telegram Mini App. This approach provides the full
development experience.

## Deploy

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out
the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for
more details.

## Useful Links

- [Platform documentation](https://docs.telegram-mini-apps.com/)
- [@telegram-apps/sdk-react documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk-react)
- [Telegram developers community chat](https://t.me/devs)

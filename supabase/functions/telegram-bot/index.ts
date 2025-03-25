import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log('Telegram Bot Function Started')

interface InlineKeyboardButton {
  text: string
  url?: string
  web_app?: {
    url: string
  }
  callback_data?: string
}

interface ReplyMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

interface SendMessageParams {
  chat_id: number
  text: string
  parse_mode?: string
  reply_markup?: ReplyMarkup
}

// 간단한 로깅 함수
function log(message: string, data?: any) {
  console.log(`[TELEGRAM BOT] ${message}`, data ? JSON.stringify(data) : '')
}

// 봇 토큰 가져오기
const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
if (!BOT_TOKEN) {
  log('ERROR: TELEGRAM_BOT_TOKEN is not set')
}

// TG API에 메시지 보내기
async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any): Promise<any> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  const params = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: replyMarkup
  }

  log('Sending message to Telegram API', params)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })

    const result = await response.json()
    log('Telegram API response', result)
    return result
  } catch (error) {
    log('Error in sendTelegramMessage', error)
    throw error
  }
}

// 메인 핸들러
serve(async (req) => {
  // 응답 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // 요청 세부 정보 로깅
  log('Request received', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  // OPTIONS 요청 처리 (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 })
  }

  try {
    // 요청 본문을 텍스트로 가져오기
    const bodyText = await req.text()
    log('Request body (raw text)', bodyText)

    // JSON 파싱
    let update
    try {
      update = JSON.parse(bodyText)
      log('Request body (parsed JSON)', update)
    } catch (error) {
      log('Failed to parse JSON', { error: error.message })
      return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { headers, status: 400 })
    }

    // 메시지가 있는지 확인
    if (!update.message) {
      log('No message in update')
      return new Response(JSON.stringify({ ok: true, message: 'No message in update' }), { headers, status: 200 })
    }

    // 메시지와 채팅 ID 추출
    const message = update.message
    const chatId = message.chat.id
    const text = message.text || ''

    log('Message info', { chatId, text })

    // /start 명령어 처리
    if (text.includes('/start')) {
      log('Start command detected')

      const welcomeMessage = `🎮 Welcome to FragTopu! 🏆

Get ready for an exciting gaming experience on Telegram! 🚀 Ahead of you lie fun mini-games, daily quests, and a chance to compete with friends!

🎯 Play the Clicker Game and test your tapping skills!
📈 Bet on SOL price movements and earn points!
🏅 Complete daily tasks for bonus rewards!
🌟 Climb the global leaderboards and show off your skills!

Ready to start your journey?
Press the button below and let's begin the adventure!`

      const replyMarkup = {
        inline_keyboard: [
          [
            {
              text: 'Start Playing',
              web_app: {
                url: 'https://fragmetric-tg-miniapp.vercel.app/index.html'
              }
            }
          ],
          [
            {
              text: 'Our Community',
              url: 'https://t.me/fragmetric_community'
            }
          ]
        ]
      }

      try {
        const result = await sendTelegramMessage(chatId, welcomeMessage, replyMarkup)
        log('Welcome message sent successfully', result)
      } catch (error) {
        log('Error sending welcome message', error)
        return new Response(JSON.stringify({ ok: false, error: 'Failed to send message' }), { headers, status: 500 })
      }
    } else {
      // 기본 응답
      log('Sending default response')
      try {
        await sendTelegramMessage(chatId, 'Type /start to begin!')
        log('Default message sent successfully')
      } catch (error) {
        log('Error sending default message', error)
      }
    }

    // Telegram에 200 OK 응답 (이게 중요합니다)
    return new Response(JSON.stringify({ ok: true }), { headers, status: 200 })
  } catch (error) {
    // 오류 로깅 및 응답
    log('Error processing request', {
      error: error.message,
      stack: error.stack
    })

    return new Response(JSON.stringify({ ok: false, error: error.message }), { headers, status: 500 })
  }
})

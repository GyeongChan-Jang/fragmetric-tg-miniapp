const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // 기본 태스크 생성
  const tasks = [
    {
      id: '1',
      name: '첫 클릭',
      description: '클리커 게임에서 첫 번째 클릭을 해보세요',
      score_reward: 5,
      type: 'ONE_TIME',
      task_key: 'first_click'
    },
    {
      id: '2',
      name: '10번 클릭',
      description: '클리커 게임에서 10번 클릭해보세요',
      score_reward: 10,
      type: 'ONE_TIME',
      task_key: 'click_10'
    },
    {
      id: '3',
      name: '100번 클릭',
      description: '클리커 게임에서 100번 클릭해보세요',
      score_reward: 50,
      type: 'ONE_TIME',
      task_key: 'click_100'
    },
    {
      id: '4',
      name: '일일 클릭',
      description: '오늘 클리커 게임을 10번 이상 클릭하세요',
      score_reward: 15,
      type: 'DAILY',
      task_key: 'daily_click'
    },
    {
      id: '5',
      name: '첫 베팅',
      description: 'SOL 베팅 게임에서 첫 번째 베팅을 해보세요',
      score_reward: 10,
      type: 'ONE_TIME',
      task_key: 'first_bet'
    },
    {
      id: '6',
      name: '베팅 승리',
      description: 'SOL 베팅 게임에서 승리하세요',
      score_reward: 25,
      type: 'ONE_TIME',
      task_key: 'first_bet_win'
    },
    {
      id: '7',
      name: '일일 베팅',
      description: '오늘 베팅 게임을 최소 1회 진행하세요',
      score_reward: 20,
      type: 'DAILY',
      task_key: 'daily_bet'
    },
    {
      id: '8',
      name: '친구 초대',
      description: '친구 한 명을 초대하세요',
      score_reward: 50,
      type: 'SOCIAL',
      task_key: 'invite_friend'
    }
  ]

  console.log(`기본 태스크 ${tasks.length}개 생성 시작...`)

  // 기존 태스크를 모두 지우고 새로 생성
  await prisma.task.deleteMany()

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: task,
      create: task
    })
  }

  console.log('기본 태스크 생성 완료')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

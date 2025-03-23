import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 유저의 태스크 목록 가져오기
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 유저의 태스크 목록 가져오기
    const userTasks = await prisma.userTask.findMany({
      where: { user_id: userId },
      include: { task: true }
    })

    return NextResponse.json({ userTasks })
  } catch (error) {
    console.error('Error fetching user tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch user tasks' }, { status: 500 })
  }
}

// 태스크 완료 처리
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taskId } = body

    if (!userId || !taskId) {
      return NextResponse.json({ error: 'User ID and Task ID are required' }, { status: 400 })
    }

    // 유저 태스크 찾기
    const userTask = await prisma.userTask.findUnique({
      where: {
        user_id_task_id: {
          user_id: userId,
          task_id: taskId
        }
      },
      include: { task: true }
    })

    if (!userTask) {
      return NextResponse.json({ error: 'User task not found' }, { status: 404 })
    }

    // 이미 완료된 태스크인지 확인
    if (userTask.completed) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 })
    }

    // 태스크가 일일 태스크이고 오늘 이미 완료했는지 확인
    if (userTask.task.type === 'DAILY' && userTask.completed_at) {
      const completedDate = new Date(userTask.completed_at)
      const today = new Date()

      // 날짜만 비교 (시간 제외)
      if (
        completedDate.getFullYear() === today.getFullYear() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getDate() === today.getDate()
      ) {
        return NextResponse.json({ error: 'Daily task already completed today' }, { status: 400 })
      }
    }

    // 태스크 완료 처리
    const updatedUserTask = await prisma.userTask.update({
      where: {
        user_id_task_id: {
          user_id: userId,
          task_id: taskId
        }
      },
      data: {
        completed: true,
        completed_at: new Date()
      },
      include: { task: true }
    })

    // 유저의 점수 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: {
        total_score: { increment: userTask.task.score_reward }
      }
    })

    return NextResponse.json({ userTask: updatedUserTask })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 })
  }
}

// 태스크 생성 (어드민용)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, score_reward, type, task_key } = body

    if (!name || !description || !type || !task_key) {
      return NextResponse.json({ error: 'Name, description, type, and task_key are required' }, { status: 400 })
    }

    // 같은 task_key로 이미 존재하는지 확인
    const existingTask = await prisma.task.findUnique({
      where: { task_key }
    })

    if (existingTask) {
      return NextResponse.json({ error: 'Task with this task_key already exists' }, { status: 400 })
    }

    // 새 태스크 생성
    const newTask = await prisma.task.create({
      data: {
        name,
        description,
        score_reward: score_reward || 10,
        type,
        task_key
      }
    })

    // 모든 유저에게 태스크 할당
    const users = await prisma.user.findMany()
    await Promise.all(
      users.map((user) =>
        prisma.userTask.create({
          data: {
            user_id: user.id,
            task_id: newTask.id,
            completed: false
          }
        })
      )
    )

    return NextResponse.json({ task: newTask })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

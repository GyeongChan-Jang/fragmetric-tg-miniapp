import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 유저의 태스크 목록 가져오기
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // 사용자의 모든 태스크 조회 (기본 태스크 및 완료 상태 포함)
    const { data, error } = await supabase
      .from('user_tasks')
      .select(
        `
        *,
        task:tasks(*)
      `
      )
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }

    // 응답 데이터 포맷팅
    const tasks = data.map((item) => ({
      id: item.task?.id,
      title: item.task?.title,
      description: item.task?.description,
      reward: item.task?.reward,
      completed: item.completed,
      user_task_id: item.id
    }))

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// 태스크 완료 처리
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taskId } = body

    if (!userId || !taskId) {
      return NextResponse.json({ error: 'User ID and Task ID are required' }, { status: 400 })
    }

    // 해당 태스크가 이미 완료되었는지 확인
    const { data: existingTask, error: fetchError } = await supabase
      .from('user_tasks')
      .select('id, completed, task:tasks(reward)')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single()

    if (fetchError) {
      console.error('Error fetching task:', fetchError)
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // 이미 완료된 태스크인 경우
    if (existingTask?.completed) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 })
    }

    // 트랜잭션 처리: 태스크 완료 및 사용자 점수 업데이트
    // task 필드는 배열이므로 첫 번째 요소의 reward 값을 사용
    const reward = existingTask?.task?.[0]?.reward || 0

    // 1. 태스크 완료 처리
    const { error: updateTaskError } = await supabase
      .from('user_tasks')
      .update({ completed: true })
      .eq('id', existingTask?.id)

    if (updateTaskError) {
      console.error('Error updating task completion status:', updateTaskError)
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }

    // 2. 사용자 점수 업데이트
    const { data: user, error: fetchUserError } = await supabase
      .from('users')
      .select('total_score')
      .eq('id', userId)
      .single()

    if (fetchUserError) {
      console.error('Error fetching user:', fetchUserError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        total_score: (user?.total_score || 0) + reward
      })
      .eq('id', userId)

    if (updateUserError) {
      console.error('Error updating user score:', updateUserError)
      return NextResponse.json({ error: 'Failed to update user score' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Task completed and ${reward} points added to user's score`
    })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 })
  }
}

// 태스크 생성 (어드민용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, reward, taskType } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    // 새 태스크 생성
    const { data: newTask, error: createTaskError } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          reward: reward || 10,
          task_type: taskType || 'general'
        }
      ])
      .select()
      .single()

    if (createTaskError) {
      console.error('Error creating task:', createTaskError)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    // 모든 사용자에게 태스크 할당
    const { data: users, error: usersError } = await supabase.from('users').select('id')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // 각 사용자에게 태스크 할당
    const userTasksData = users.map((user) => ({
      user_id: user.id,
      task_id: newTask.id,
      completed: false
    }))

    const { error: createUserTasksError } = await supabase.from('user_tasks').insert(userTasksData)

    if (createUserTasksError) {
      console.error('Error assigning tasks to users:', createUserTasksError)
      return NextResponse.json({ error: 'Failed to assign tasks to users' }, { status: 500 })
    }

    return NextResponse.json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

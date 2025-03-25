import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This file is a placeholder for server functions.
// Since we're using static export, real API routes won't be included in the build.
export const dynamic = 'force-static'

// 태스크 정보 가져오기 (정적 내보내기에서는 사용되지 않음)
export async function GET() {
  return new Response(JSON.stringify({ message: 'This API is not available in static export mode' }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  })
}

// 태스크 완료 처리 (정적 내보내기에서는 사용되지 않음)
export async function PUT() {
  return new Response(JSON.stringify({ message: 'This API is not available in static export mode' }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  })
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

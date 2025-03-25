import { create } from 'zustand'
import { Task, UserTask } from '@/types'
import { supabase } from '@/lib/supabase'
import { useUserStore } from './userStore'

interface TaskState {
  tasks: Task[]
  userTasks: UserTask[]
  isLoading: boolean
  error: string | null

  setTasks: (tasks: Task[]) => void
  setUserTasks: (userTasks: UserTask[]) => void
  completeTask: (userTaskId: string) => Promise<void>
  fetchTasks: (userId: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  userTasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  setUserTasks: (userTasks) => set({ userTasks }),

  completeTask: async (userTaskId) => {
    set({ isLoading: true, error: null })

    try {
      // 태스크 정보 및 보상 가져오기
      const { data: userTaskData, error: fetchError } = await supabase
        .from('user_tasks')
        .select('id, task_id, task:tasks(score_reward)')
        .eq('id', userTaskId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      if (!userTaskData) {
        throw new Error('Task not found')
      }

      // 이미 완료된 태스크인지 확인
      const { data: existingTask, error: checkError } = await supabase
        .from('user_tasks')
        .select('completed')
        .eq('id', userTaskId)
        .single()

      if (checkError) {
        throw checkError
      }

      if (existingTask?.completed) {
        throw new Error('Task already completed')
      }

      // 태스크 완료 처리
      const { error: updateError } = await supabase
        .from('user_tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', userTaskId)

      if (updateError) {
        throw updateError
      }

      // 보상 적용
      const reward = userTaskData.task?.[0]?.score_reward || 0
      const user = useUserStore.getState().user

      if (user && reward > 0) {
        // 유저 총점 업데이트
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            total_score: (user.total_score || 0) + reward
          })
          .eq('id', user.id)

        if (userUpdateError) {
          console.error('Error updating user score:', userUpdateError)
        } else {
          // 로컬 유저 스토어 업데이트
          const updatedUser = {
            ...user,
            total_score: (user.total_score || 0) + reward
          }
          useUserStore.getState().setUser(updatedUser)
        }
      }

      // 로컬 상태 업데이트
      set((state) => ({
        userTasks: state.userTasks.map((ut) =>
          ut.id === userTaskId
            ? {
                ...ut,
                completed: true,
                completed_at: new Date()
              }
            : ut
        ),
        isLoading: false
      }))
    } catch (err) {
      console.error('Error completing task:', err)
      set({
        error: err instanceof Error ? err.message : 'Failed to complete task',
        isLoading: false
      })
    }
  },

  fetchTasks: async (userId) => {
    set({ isLoading: true, error: null })

    try {
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
        throw error
      }

      if (!data || data.length === 0) {
        // 태스크가 없는 경우 기본 태스크 생성
        const { data: basicTasks, error: basicTasksError } = await supabase.from('tasks').select('*')

        if (basicTasksError) {
          throw basicTasksError
        }

        if (basicTasks && basicTasks.length > 0) {
          // 유저에게 기본 태스크 할당
          const userTasksData = basicTasks.map((task) => ({
            user_id: userId,
            task_id: task.id,
            completed: false
          }))

          const { data: newUserTasks, error: createError } = await supabase
            .from('user_tasks')
            .insert(userTasksData)
            .select(
              `
              *,
              task:tasks(*)
            `
            )

          if (createError) {
            throw createError
          }

          // 응답 데이터 포맷팅
          const formattedTasks = (newUserTasks || []).map((item) => ({
            id: item.id,
            user_id: item.user_id,
            task_id: item.task_id,
            completed: item.completed,
            completed_at: item.completed_at,
            task: item.task
          }))

          set({
            userTasks: formattedTasks,
            tasks: basicTasks,
            isLoading: false
          })
        } else {
          set({
            userTasks: [],
            tasks: [],
            isLoading: false
          })
        }
      } else {
        // 응답 데이터 포맷팅
        const formattedTasks = data.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          task_id: item.task_id,
          completed: item.completed,
          completed_at: item.completed_at,
          task: item.task
        }))

        // 고유한 태스크 목록 추출
        const uniqueTasks = Array.from(new Set(data.map((item) => item.task?.id)))
          .map((taskId) => {
            const taskItem = data.find((item) => item.task?.id === taskId)
            return taskItem?.task
          })
          .filter(Boolean)

        set({
          userTasks: formattedTasks,
          tasks: uniqueTasks as Task[],
          isLoading: false
        })
      }
    } catch (err) {
      console.error('Error fetching tasks:', err)
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch tasks',
        isLoading: false
      })
    }
  }
}))

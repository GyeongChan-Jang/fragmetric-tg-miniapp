import { create } from 'zustand'
import { Task, UserTask } from '@/types'

interface TaskState {
  tasks: Task[]
  userTasks: UserTask[]
  isLoading: boolean
  error: string | null

  setTasks: (tasks: Task[]) => void
  setUserTasks: (userTasks: UserTask[]) => void
  completeTask: (taskId: string) => Promise<void>
  fetchTasks: () => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  userTasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  setUserTasks: (userTasks) => set({ userTasks }),

  completeTask: async (taskId) => {
    set({ isLoading: true, error: null })

    try {
      // 실제 구현에서는 API를 호출하여 서버에 작업 완료 정보를 저장합니다.
      // 여기서는 로컬 state 업데이트만 수행합니다.
      const { userTasks } = get()

      const updatedUserTasks = userTasks.map((userTask) => {
        if (userTask.task_id === taskId) {
          return {
            ...userTask,
            completed: true,
            completed_at: new Date()
          }
        }
        return userTask
      })

      // 잠시 지연시켜 로딩 상태 확인
      await new Promise((resolve) => setTimeout(resolve, 500))

      set({ userTasks: updatedUserTasks, isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to complete task',
        isLoading: false
      })
    }
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null })

    try {
      // 실제 구현에서는 API를 호출하여 서버에서 작업 데이터를 가져옵니다.
      // 여기서는 예시 데이터를 사용합니다.
      const mockTasks: Task[] = [
        {
          id: '1',
          name: 'Daily Check-in',
          description: 'Get daily points by checking in',
          score_reward: 10,
          type: 'DAILY',
          task_key: 'daily_check_in'
        },
        {
          id: '2',
          name: 'Follow on X',
          description: 'Follow Fragmetric on X',
          score_reward: 50,
          type: 'SOCIAL',
          task_key: 'follow_x'
        },
        {
          id: '3',
          name: 'Join Telegram Channel',
          description: 'Join the official Telegram channel',
          score_reward: 50,
          type: 'SOCIAL',
          task_key: 'join_telegram'
        },
        {
          id: '4',
          name: 'Join Discord Server',
          description: 'Join the official Discord server',
          score_reward: 50,
          type: 'SOCIAL',
          task_key: 'join_discord'
        }
      ]

      const mockUserTasks: UserTask[] = mockTasks.map((task) => ({
        id: `user-task-${task.id}`,
        user_id: 'temp-user', // 실제 유저 ID로 대체해야 합니다
        task_id: task.id,
        completed: false,
        task
      }))

      // 잠시 지연시켜 로딩 상태 확인
      await new Promise((resolve) => setTimeout(resolve, 500))

      set({
        tasks: mockTasks,
        userTasks: mockUserTasks,
        isLoading: false
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch tasks',
        isLoading: false
      })
    }
  }
}))

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTaskStore } from '@/store/taskStore'
import { useUserStore } from '@/store/userStore'
import { TaskType } from '@/types'

export const TaskList: React.FC = () => {
  const { tasks, userTasks, isLoading, error, completeTask } = useTaskStore()
  const { user } = useUserStore()
  const [activeTaskType, setActiveTaskType] = useState<TaskType | 'ALL'>('ALL')

  // 작업 유형별로 필터링하기
  const filteredTasks =
    activeTaskType === 'ALL' ? userTasks : userTasks.filter((ut) => ut.task?.type === activeTaskType)

  // 작업 완료 처리하기
  const handleCompleteTask = async (taskId: string) => {
    if (!user) return
    await completeTask(taskId)
  }

  // 작업 유형에 따른 아이콘 선택하기
  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'DAILY':
        return '🔄'
      case 'SOCIAL':
        return '🌐'
      case 'ONE_TIME':
        return '⭐'
      default:
        return '📋'
    }
  }

  // 버튼 컴포넌트
  const FilterButton: React.FC<{
    label: string
    value: TaskType | 'ALL'
    count: number
  }> = ({ label, value, count }) => (
    <button
      className={`px-3 py-1 text-sm rounded-full ${
        activeTaskType === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={() => setActiveTaskType(value)}
    >
      {label} ({count})
    </button>
  )

  return (
    <div className="w-full">
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <FilterButton label="All" value="ALL" count={userTasks.length} />
        <FilterButton label="Daily" value="DAILY" count={userTasks.filter((ut) => ut.task?.type === 'DAILY').length} />
        <FilterButton
          label="Social"
          value="SOCIAL"
          count={userTasks.filter((ut) => ut.task?.type === 'SOCIAL').length}
        />
        <FilterButton
          label="One-time"
          value="ONE_TIME"
          count={userTasks.filter((ut) => ut.task?.type === 'ONE_TIME').length}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-300 p-3 rounded-lg text-red-700 text-sm">{error}</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((userTask) => (
            <motion.div
              key={userTask.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                userTask.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{getTaskIcon(userTask.task?.type as TaskType)}</span>
                    <h3 className="font-semibold">{userTask.task?.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{userTask.task?.description}</p>

                  {userTask.completed && userTask.completed_at && (
                    <p className="text-xs text-green-600 mt-2">
                      Completed on {new Date(userTask.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="ml-4">
                  {userTask.completed ? (
                    <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      +{userTask.task?.score_reward || 0} pts
                    </div>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-lg"
                      onClick={() => handleCompleteTask(userTask.task_id)}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList

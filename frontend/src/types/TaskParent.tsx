export interface Task {
  id: number
  title: string
  description: string
  due_date: string
  reward_amount: number
  child_id: number
  parent_id: number
  task_category_id: number
  recurrence: string | null
  recurringType?: string
  isRecurring?: boolean
  completion_status: "none" | "submitted" | "approved" | "rejected" | null
  created_at: string
  updated_at: string
  recurringDays?: string[]  
  comments_count?: number

  child: {
    id: number
    name: string
    avatar: string
    role: string
    theme: string
    created_at: string
    updated_at: string
  }

  task_category: {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
  }

  latest_submission?: {
    id: number
    task_id: number
    user_id: number
    submitted_at: string
    status: "submitted" | "approved" | "rejected"
    created_at: string
    updated_at: string
  } | null
}
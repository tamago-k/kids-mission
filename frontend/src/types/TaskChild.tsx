export interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  completion_status?: "approved" | "submitted" | "rejected" | "pending"
  approved_at?: string | null
  reward_amount: number | null
  due_date?: string | null
  child?: {
    name: string
    avatar: string
    theme?: string
  } | null
  isRecurring?: boolean
  recurringType?: "daily" | "weekly" | "monthly"
  task_category?: {
    id: number
    name: string
    slug: string
  } | null
}
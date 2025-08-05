export interface RewardRequest {
  id: number
  reward_id: number
  status: "submitted" | "approved" | "rejected"
  requested_at: string
  created_at: string
  updated_at: string
  reward: {
    id: number
    name: string
    icon: string
    need_reward: number
    created_at: string
    updated_at: string
  }
  user: {
    id: number
    name: string
    avatar: string
    role: "child"
    theme: string
    created_at: string
    updated_at: string
  }
}

export interface Task {
  id: number
  title: string
  description: string
  due_date: string
  reward_amount: number
  isRecurring: boolean
  recurrence: "daily" | "weekly" | "monthly" | "weekdays" | "weekends" | null
  recurringType: string | null
  completion_status: "submitted" | "approved" | "rejected" | null;
  child_id: number
  parent_id: number
  created_at: string
  updated_at: string
  task_category_id: number
  task_category: {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
  }
  child: {
    id: number
    name: string
    avatar: string
    theme: string
    role: "child"
    created_at: string
    updated_at: string
  }
  latest_submission: {
    id: number
    task_id: number
    user_id: number
    status: "submitted" | "approved" | "rejected"
    submitted_at: string
    created_at: string
    updated_at: string
  } | null
}
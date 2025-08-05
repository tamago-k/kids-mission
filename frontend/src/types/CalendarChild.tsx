export interface Child {
  avatar: string;
  created_at: string;
  id: number;
  name: string;
  role: string;
  theme: string;
  updated_at: string;
};

export interface TaskCategory {
  created_at: string;
  id: number;
  name: string;
  slug: string;
  updated_at: string;
};

export interface Task {
  child: Child;
  child_id: number;
  completion_status: string | null;
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  isRecurring: boolean;
  parent_id: number;
  recurrence: string;
  recurringType: string;
  reward_amount: number;
  task_category: TaskCategory;
  task_category_id: number;
  title: string;
  updated_at: string;
};

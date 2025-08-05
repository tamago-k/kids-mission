export interface Submission {
  created_at: string;
  id: number;
  status: string;
  submitted_at: string;
  task_id: number;
  updated_at: string;
  user_id: number;
};

export interface Task {
  child_id: number;
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  isRecurring: boolean;
  parent_id: number;
  recurrence: string | null;
  recurringType: string | null;
  reward_amount: number;
  submission: Submission | null;
  task_category_id: number;
  title: string;
  updated_at: string;
};
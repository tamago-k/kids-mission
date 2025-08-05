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
  child: Child;
  child_id: number;
  completion_status: string;
  created_at: string;
  description: string;
  due_date: string;
  id: number;
  isRecurring: boolean;
  latest_submission: Submission | null;
  parent_id: number;
  recurrence: string;
  recurringType: string;
  reward_amount: number;
  task_category: TaskCategory;
  task_category_id: number;
  title: string;
  updated_at: string;
};

export interface CalendarTask {
  id: number;
  title: string;
  date: Date;
  child: Child;
  childId: string;
  childName: string;
  status: string;
  reward: number;
  time: string;
};
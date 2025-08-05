export interface Reward {
  id: number;
  name: string;
  icon: string;
  need_reward: number;
  created_at: string;
  updated_at: string;
};

export interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
  theme: string;
  created_at: string;
  updated_at: string;
};

export interface RewardRequest {
  id: number;
  reward_id: number;
  status: string;
  requested_at: string;
  created_at: string;
  updated_at: string;
  reward: Reward;
  user_id: number;
  user: User;
};
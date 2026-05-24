export type Role = 'developer' | 'manager' | 'executive';

export interface Persona {
  id: string;
  name: string;
  roleType: Role;
  title: string;
  avatarUrl: string;
  checkedIn: boolean;
  checkInTime?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Maintenance' | 'Staged';
  priority: 'High' | 'Medium' | 'Low' | 'High Priority' | 'Maintenance';
  manager: string;
  managerAvatar: string;
  dueDate: string;
  progress: number;
  budget: string;
  spent: string;
  activeTokensCount: number;
  teamAvatars: string[];
  initiativeType?: 'tech' | 'fin' | 'marketing';
}

export interface Token {
  id: string;
  code: string;
  projectTitle: string;
  title: string;
  description: string;
  status: 'available' | 'in_progress' | 'completed';
  priority: 'High' | 'Medium' | 'Low' | 'High Priority';
  assignee?: {
    name: string;
    avatarUrl: string;
  };
  durationElapsed?: string;
  pausedAt?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  timestamp: string;
  content: string;
  isMe: boolean;
}

export interface UpdateLog {
  id: string;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  content: string;
  codeSnippet?: string;
  badgeColor: 'primary' | 'warning' | 'success' | 'info';
}

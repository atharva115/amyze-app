export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string; // The biological name
  realName?: string; // Hidden
  college: string;
  role: UserRole;
  isBanned: boolean;
  joinedAt: Date;
  avatarSeed: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  college: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: Date;
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
}

export enum ChatTopic {
  MENTAL_HEALTH = "Mental Health",
  UNSERIOUS = "Unserious Talk",
  DATING = "Dating / Match",
  CASES = "Clinical Cases",
  EXAMS = "Exam Stress"
}

export interface ChatSession {
  id: string;
  topic: ChatTopic;
  peerName: string;
  messages: Message[];
}

import { User, Post, UserRole } from '../types';

// Initial Dummy Data
export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'u2',
    authorName: 'Sarcastic Spleen',
    authorAvatar: 'seed2',
    college: 'Harvard Med',
    content: 'Does anyone else feel like they are just memorizing the phone book but for the human body? 📚💀 #anatomy #struggle',
    likes: 42,
    comments: 5,
    timestamp: new Date(Date.now() - 3600000),
    tags: ['anatomy', 'rant']
  },
  {
    id: '2',
    authorId: 'u3',
    authorName: 'Captain Cortisol',
    authorAvatar: 'seed3',
    college: 'Johns Hopkins',
    content: 'Just diagnosed myself with 3 rare diseases after reading WebMD for 5 minutes. Standard procedure right? 😅',
    likes: 128,
    comments: 12,
    timestamp: new Date(Date.now() - 7200000),
    tags: ['humor', 'hypochondria']
  },
  {
    id: '3',
    authorId: 'u4',
    authorName: 'Lady Lymphocyte',
    authorAvatar: 'seed4',
    college: 'Stanford Medicine',
    content: 'Looking for study partners for the upcoming boards. Serious inquiries only! 🩺',
    likes: 15,
    comments: 2,
    timestamp: new Date(Date.now() - 86400000),
    tags: ['study', 'boards']
  }
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'Admin', role: UserRole.ADMIN, isBanned: false, joinedAt: new Date(), college: 'System', avatarSeed: 'admin', realName: 'System Admin' },
  { id: 'u2', username: 'Sarcastic Spleen', role: UserRole.USER, isBanned: false, joinedAt: new Date(), college: 'Harvard Med', avatarSeed: 'seed2', realName: 'John Doe' },
  { id: 'u3', username: 'Captain Cortisol', role: UserRole.USER, isBanned: false, joinedAt: new Date(), college: 'Johns Hopkins', avatarSeed: 'seed3', realName: 'Jane Smith' },
  { id: 'u4', username: 'Lady Lymphocyte', role: UserRole.USER, isBanned: true, joinedAt: new Date(), college: 'Stanford Medicine', avatarSeed: 'seed4', realName: 'Emily Blunt' },
];

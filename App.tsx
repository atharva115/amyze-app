import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateBiologicalName, getPeerReply } from './services/geminiService';
import { User, Post, UserRole, ChatTopic, Message, ChatSession } from './types';
import { INITIAL_USERS, INITIAL_POSTS } from './services/mockStore';
import { Sidebar, BottomNav } from './components/Navigation';

// --- SUB-COMPONENTS (Pages) ---

// 1. LANDING & LOGIN
const LandingPage = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [step, setStep] = useState<'welcome' | 'details' | 'generating'>('welcome');
  const [realName, setRealName] = useState('');
  const [college, setCollege] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleStart = async () => {
    if (!realName || !college) return;
    setStep('generating');
    
    // Check if admin
    if (realName.toLowerCase() === 'admin' && college.toLowerCase() === 'system') {
       const adminUser = INITIAL_USERS[0];
       setTimeout(() => onLogin(adminUser), 1000);
       return;
    }

    // Generate Identity
    const bioName = await generateBiologicalName();
    const newUser: User = {
      id: `u${Date.now()}`,
      username: bioName,
      realName: realName,
      college: college,
      role: UserRole.USER,
      isBanned: false,
      joinedAt: new Date(),
      avatarSeed: Math.random().toString(36).substring(7)
    };
    
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-cyan-700 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-teal-900/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        {step === 'welcome' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.761 2.165 18 5.757 18h8.486c3.592 0 4.94-3.239 3.05-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a4 4 0 00-2.329.313l.83-8.032a3 3 0 00.879-2.12z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">BioChat</h1>
            <p className="text-teal-100 mb-8">The anonymous social network exclusively for the medical community.</p>
            <button 
              onClick={() => setStep('details')}
              className="w-full bg-white text-teal-800 font-bold py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
            >
              Get My Biological Identity
            </button>
            <p className="mt-4 text-xs text-white/50">By joining, you agree to our strict anonymity protocols.</p>
          </div>
        )}

        {step === 'details' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify Credentials</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Full Name (Hidden)</label>
                <input 
                  type="text" 
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg p-3 text-white placeholder-teal-200/50 focus:outline-none focus:border-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-100 mb-1">Medical College / Hospital</label>
                <input 
                  type="text" 
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-lg p-3 text-white placeholder-teal-200/50 focus:outline-none focus:border-white"
                  placeholder="e.g., Johns Hopkins"
                />
              </div>
              <button 
                onClick={handleStart}
                disabled={!realName || !college}
                className="w-full bg-teal-400 text-teal-900 font-bold py-3 mt-4 rounded-xl hover:bg-teal-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Identity & Join
              </button>
              <button onClick={() => setStep('welcome')} className="w-full text-center text-sm text-teal-200 mt-4">Back</button>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="text-center py-10">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold animate-pulse">Synthesizing DNA...</h2>
            <p className="text-teal-100 text-sm mt-2">Assigning unique biological marker</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. FEED PAGE
const FeedPage = ({ currentUser, posts }: { currentUser: User, posts: Post[] }) => {
  const [newPost, setNewPost] = useState('');
  const [localPosts, setLocalPosts] = useState(posts);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatarSeed,
      college: currentUser.college,
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      tags: ['general']
    };
    setLocalPosts([post, ...localPosts]);
    setNewPost('');
  };

  return (
    <div className="max-w-3xl mx-auto pt-4 md:pt-8 pb-24 px-4">
      {/* Create Post */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex gap-4">
          <img 
            src={`https://picsum.photos/seed/${currentUser.avatarSeed}/200`} 
            alt="me" 
            className="w-12 h-12 rounded-full border-2 border-teal-100 object-cover" 
          />
          <div className="flex-1">
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={`What's happening, ${currentUser.username}?`}
              className="w-full bg-gray-50 rounded-xl p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2 text-gray-400">
                <button className="hover:text-teal-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
                <button className="hover:text-teal-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg></button>
              </div>
              <button 
                onClick={handlePost}
                disabled={!newPost.trim()}
                className="bg-teal-600 text-white px-6 py-2 rounded-full font-medium hover:bg-teal-700 transition disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {localPosts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <img src={`https://picsum.photos/seed/${post.authorAvatar}/200`} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-gray-800">{post.authorName}</h3>
                  <p className="text-xs text-gray-500">{post.college} • {new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
              </button>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
            
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-md">#{tag}</span>
              ))}
            </div>

            <div className="flex items-center gap-6 border-t border-gray-100 pt-3 text-gray-500 text-sm font-medium">
              <button className="flex items-center gap-2 hover:text-teal-600 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {post.comments}
              </button>
              <button className="flex items-center gap-2 hover:text-green-600 ml-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. CHAT PAGE
const ChatPage = ({ currentUser }: { currentUser: User }) => {
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startChat = (topic: ChatTopic) => {
    // Generate a random peer name
    const peerNames = ["Dr. Synapse", "Happy Heme", "Ortho Bro", "Psych Pal", "Neuro Nerd"];
    const randomPeer = peerNames[Math.floor(Math.random() * peerNames.length)];
    
    setActiveSession({
      id: Date.now().toString(),
      topic,
      peerName: randomPeer,
      messages: [
        {
          id: 'sys1',
          senderId: 'system',
          senderName: 'System',
          text: `You are connected anonymously to ${randomPeer} in ${topic}. Say Hi!`,
          timestamp: new Date(),
          isSystem: true
        }
      ]
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.username,
      text: input,
      timestamp: new Date()
    };

    const updatedSession = { ...activeSession, messages: [...activeSession.messages, userMsg] };
    setActiveSession(updatedSession);
    setInput('');
    setIsTyping(true);

    // Simulate Network & Gemini Reply
    setTimeout(async () => {
      const replyText = await getPeerReply(activeSession.topic, updatedSession.messages, activeSession.peerName);
      
      const peerMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'peer',
        senderName: activeSession.peerName,
        text: replyText,
        timestamp: new Date()
      };
      
      setActiveSession(prev => prev ? ({
        ...prev,
        messages: [...prev.messages, peerMsg]
      }) : null);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s - 2.5s delay for realism
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  // Topic Selection View
  if (!activeSession) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose a frequency</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(ChatTopic).map((topic) => (
            <button 
              key={topic}
              onClick={() => startChat(topic)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-200 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-teal-600 transition">{topic}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {topic === ChatTopic.MENTAL_HEALTH ? "Supportive peer discussion" : 
                     topic === ChatTopic.UNSERIOUS ? "Memes and banter only" : 
                     "Connect with anonymous peers"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active Chat View
  return (
    <div className="h-screen md:h-[calc(100vh-2rem)] flex flex-col bg-white md:rounded-2xl md:shadow-xl md:m-4 md:border border-gray-200 overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveSession(null)} className="md:hidden text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {activeSession.peerName[0]}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 leading-tight">{activeSession.peerName}</h3>
            <p className="text-xs text-teal-600 font-medium">{activeSession.topic}</p>
          </div>
        </div>
        <button onClick={() => setActiveSession(null)} className="text-gray-400 hover:text-red-500 text-sm font-medium px-3 py-1 bg-gray-50 rounded-lg hover:bg-red-50 transition">
          Leave
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {activeSession.messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{msg.text}</span>
              </div>
            );
          }
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm md:text-base ${
                isMe 
                  ? 'bg-teal-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t border-gray-100 flex gap-2 pb-20 md:pb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
        <button 
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50 shadow-lg"
        >
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};

// 4. ADMIN PAGE
const AdminPage = ({ users, onBanToggle }: { users: User[], onBanToggle: (id: string) => void }) => {
  return (
    <div className="max-w-5xl mx-auto pt-8 px-4 pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        Admin Dashboard
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User (Bio Name)</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Real Name (Hidden)</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">College</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-xs text-gray-400">ID: {user.id}</div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{user.realName}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{user.college}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.role !== UserRole.ADMIN && (
                    <button 
                      onClick={() => onBanToggle(user.id)}
                      className={`text-xs font-bold px-3 py-1 rounded border transition ${
                        user.isBanned 
                        ? 'border-gray-300 text-gray-600 hover:bg-gray-100' 
                        : 'border-red-200 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {user.isBanned ? 'Unban' : 'Ban User'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState('home');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // Load user from session logic (skipped for simple demo, pure state)

  const handleBanToggle = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, isBanned: !u.isBanned } : u
    ));
  };

  const handleLogin = (newUser: User) => {
    // If not existing, add to users
    if (!users.find(u => u.id === newUser.id)) {
      setUsers([...users, newUser]);
    }
    setUser(newUser);
    setPage('home');
  };

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">Your account has been suspended by the administration due to violation of community guidelines.</p>
          <button onClick={() => setUser(null)} className="text-teal-600 hover:underline">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 font-sans">
      <Sidebar 
        currentPage={page} 
        setPage={setPage} 
        userRole={user.role} 
        isLoggedIn={!!user} 
        logout={() => setUser(null)} 
      />
      
      <main className="md:ml-64 min-h-screen relative">
        {page === 'home' && <FeedPage currentUser={user} posts={posts} />}
        {page === 'chat' && <ChatPage currentUser={user} />}
        {page === 'admin' && user.role === UserRole.ADMIN && (
          <AdminPage users={users} onBanToggle={handleBanToggle} />
        )}
      </main>

      <BottomNav 
        currentPage={page} 
        setPage={setPage} 
        userRole={user.role} 
        isLoggedIn={!!user} 
        logout={() => setUser(null)} 
      />
    </div>
  );
};

export default App;

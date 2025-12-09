import React from 'react';
import { UserRole } from '../types';

interface NavProps {
  currentPage: string;
  setPage: (page: string) => void;
  userRole?: UserRole;
  isLoggedIn: boolean;
  logout: () => void;
  onInstall?: () => void;
  canInstall?: boolean;
}

export const BottomNav: React.FC<NavProps> = ({ currentPage, setPage, userRole, isLoggedIn }) => {
  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center z-50 md:hidden shadow-lg rounded-t-xl safe-area-pb">
      <button onClick={() => setPage('home')} className={`flex flex-col items-center ${currentPage === 'home' ? 'text-teal-600' : 'text-gray-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] mt-1 font-medium">Feed</span>
      </button>
      <button onClick={() => setPage('chat')} className={`flex flex-col items-center ${currentPage === 'chat' ? 'text-teal-600' : 'text-gray-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-[10px] mt-1 font-medium">Chat</span>
      </button>
      {userRole === UserRole.ADMIN && (
        <button onClick={() => setPage('admin')} className={`flex flex-col items-center ${currentPage === 'admin' ? 'text-teal-600' : 'text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">Admin</span>
        </button>
      )}
    </div>
  );
};

export const Sidebar: React.FC<NavProps> = ({ currentPage, setPage, userRole, isLoggedIn, logout, onInstall, canInstall }) => {
  if (!isLoggedIn) return null;

  return (
    <div className="hidden md:flex flex-col w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 p-6 z-40">
      <div className="flex items-center gap-2 mb-10 text-teal-600">
        <img src="icon.svg" className="w-8 h-8 rounded-lg" alt="BioChat Logo" />
        <span className="text-2xl font-bold tracking-tight">BioChat</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <button 
          onClick={() => setPage('home')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === 'home' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Community Feed
        </button>
        <button 
          onClick={() => setPage('chat')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === 'chat' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Chat Rooms
        </button>
        {userRole === UserRole.ADMIN && (
          <button 
            onClick={() => setPage('admin')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === 'admin' ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Admin Panel
          </button>
        )}
      </nav>

      <div className="space-y-2 mt-auto">
        {canInstall && (
          <button 
            onClick={onInstall}
            className="w-full flex items-center gap-3 px-4 py-3 bg-teal-600 text-white rounded-xl shadow-md hover:bg-teal-700 transition-all font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Install App
          </button>
        )}
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};
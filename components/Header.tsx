import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="h-8 w-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l.21-1.035a3.375 3.375 0 00-2.455-2.456l-1.036-.259 1.036-.259a3.375 3.375 0 002.455-2.456l.21-1.035.21 1.035a3.375 3.375 0 002.456 2.456l1.035.259-1.035.259a3.375 3.375 0 00-2.456 2.456l-.21 1.035z" />
          </svg>
          <h1 className="text-xl font-bold text-slate-100">AI Product Photography Studio</h1>
        </div>
        <span className="text-sm font-medium text-violet-300 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/30">
            Case Generator
        </span>
      </div>
    </header>
  );
};

export default Header;
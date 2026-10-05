import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-purple-50/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-purple-900 animate-pulse">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      {text && <p className="text-sm font-medium text-purple-700">{text}</p>}
    </div>
  );
};

export default Loading;

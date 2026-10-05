import React, { useState } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';

const SearchBar = ({ onSearch, initialKeyword = '', initialLocation = '' }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword: keyword.trim(), location: location.trim() });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100 flex flex-col md:flex-row items-center gap-2.5 transition focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100"
    >
      <div className="flex items-center gap-3 w-full md:flex-1 px-3 py-2">
        <Search className="w-5 h-5 text-purple-600 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, skills (React, Python), company name (TechNova)..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-purple-100" />

      <div className="flex items-center gap-3 w-full md:w-72 px-3 py-2">
        <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state, or 'Remote'..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-6 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-md shadow-purple-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-98"
      >
        <span>Search Jobs</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;

import React from 'react';
import { Filter, RotateCcw, X, Check } from 'lucide-react';

const CATEGORIES = [
  'Software Engineering',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Data Science & AI',
  'DevOps & Cloud',
  'Mobile App Development',
  'UI/UX Design',
  'Quality Assurance & Testing'
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = [
  { label: 'Fresher (0-1 yrs)', value: 'Fresher' },
  { label: '1 - 3 years', value: '1-3' },
  { label: '3 - 5 years', value: '3-5' },
  { label: '5+ years', value: '5+' }
];

const FilterPanel = ({ filters, onChange, onReset, isMobileOpen, onCloseMobile }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Job Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full text-xs bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Work Mode
        </label>
        <div className="space-y-2">
          {WORK_MODES.map((mode) => {
            const isSelected = filters.workMode === mode;
            return (
              <label
                key={mode}
                onClick={() => handleChange('workMode', isSelected ? '' : mode)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border cursor-pointer transition ${
                  isSelected
                    ? 'bg-purple-100/70 border-purple-300 text-purple-800'
                    : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/50 hover:text-purple-700'
                }`}
              >
                <span>{mode}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-700" />}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Employment Type
        </label>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => {
            const isSelected = filters.jobType === type;
            return (
              <label
                key={type}
                onClick={() => handleChange('jobType', isSelected ? '' : type)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border cursor-pointer transition ${
                  isSelected
                    ? 'bg-purple-100/70 border-purple-300 text-purple-800'
                    : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/50 hover:text-purple-700'
                }`}
              >
                <span>{type}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-700" />}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Experience Level
        </label>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((exp) => {
            const isSelected = filters.experience === exp.value;
            return (
              <label
                key={exp.value}
                onClick={() => handleChange('experience', isSelected ? '' : exp.value)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border cursor-pointer transition ${
                  isSelected
                    ? 'bg-purple-100/70 border-purple-300 text-purple-800'
                    : 'bg-white border-purple-100 text-slate-600 hover:bg-purple-50/50 hover:text-purple-700'
                }`}
              >
                <span>{exp.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-700" />}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 bg-white rounded-2xl border border-purple-100/90 p-5 shadow-sm shrink-0 self-start sticky top-24">
        {content}
      </aside>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
              <h3 className="text-base font-bold text-slate-900">Refine Search</h3>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <button
              onClick={onCloseMobile}
              className="mt-8 w-full py-3 gradient-brand text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-500/25 cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;

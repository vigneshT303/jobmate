import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, ChevronRight } from 'lucide-react';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center gap-3.5">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-xl object-cover border border-purple-100 shadow-sm bg-purple-50/50 shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0 ${
              company.logo ? 'hidden' : 'flex'
            }`}
          >
            <Building2 className="w-6 h-6" />
          </div>

          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition truncate">
              {company.name}
            </h3>
            <span className="inline-block text-xs font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md mt-0.5 border border-purple-200/60">
              {company.industry}
            </span>
          </div>
        </div>

        <p className="mt-3.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 bg-purple-50/50 px-2.5 py-1 rounded-lg border border-purple-100">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            {company.location}
          </span>
          {company.employeeCount && (
            <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              {company.employeeCount}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-purple-50 flex items-center justify-between text-xs">
        <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/80 flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-purple-600" />
          {company.activeJobsCount || 0} Openings
        </span>

        <Link
          to={`/companies/${company._id}`}
          className="inline-flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-800 transition group-hover:translate-x-0.5"
        >
          View Company
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;

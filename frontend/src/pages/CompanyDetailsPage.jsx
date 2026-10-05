import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companiesAPI } from '../services/api';
import JobCard from '../components/common/JobCard';
import Loading from '../components/common/Loading';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Briefcase,
  ArrowLeft,
  Mail
} from 'lucide-react';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await companiesAPI.getById(id);
        setCompany(res.data.data.company);
        setJobs(res.data.data.jobs || []);
      } catch (err) {
        console.error('[CompanyDetails] Failed to load company', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return <Loading fullScreen text="Loading company information..." />;
  }

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Company Not Found</h2>
        <Link to="/companies" className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Companies Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all companies
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl shrink-0">
                <Building2 className="w-10 h-10" />
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                {company.industry}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {company.name}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company.location}
                </span>
                {company.employeeCount && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {company.employeeCount}
                    </span>
                  </>
                )}
                {company.foundedYear && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Founded {company.foundedYear}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {company.website && (
            <div>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl border border-indigo-200 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition inline-flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Company Website
              </a>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Overview</h3>
            <p>{company.description}</p>
          </div>
          {company.about && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About the Organization</h3>
              <p>{company.about}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Open Positions at {company.name} ({jobs.length})
            </h2>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500 text-sm">
            There are currently no active job vacancies listed for this company. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={{ ...job, company }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPage;

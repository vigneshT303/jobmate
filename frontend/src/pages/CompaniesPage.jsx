import React, { useState, useEffect } from 'react';
import { companiesAPI } from '../services/api';
import CompanyCard from '../components/common/CompanyCard';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';
import { Search } from 'lucide-react';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companiesAPI.getAll({ search, page, limit: 12 });
      setCompanies(res.data.data.companies || []);
      setPagination(res.data.meta?.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCompanies();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Top <span className="gradient-text font-black">Companies</span> Hiring
        </h1>
        <p className="text-sm text-purple-700/80 mt-1">
          Explore leading technology enterprises, hyper-growth startups, and established software engineering firms.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-md flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company name, industry, tech..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 gradient-brand text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-md shadow-purple-500/20 transition cursor-pointer"
        >
          Search
        </button>
      </form>

      {loading ? (
        <Loading text="Loading verified companies..." />
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-purple-100 p-12 text-center text-slate-500">
          No companies found matching "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((comp) => (
            <CompanyCard key={comp._id} company={comp} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default CompaniesPage;

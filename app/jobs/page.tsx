"use client";

import React, { useState, useRef, useEffect } from "react";
import { Job, jobs } from "../../data/jobsData";
import JobFrame from '../../components/JobFrame';
import HeaderTabs from "../../components/HeaderTabs";
import NewJobFrame from "../../components/NewJobFrame";
import LargeJobFrame from "../../components/LargeJobFrame";

interface HeaderProps {
  title: string;
  tabs: { name: string; href: string }[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = React.memo(({ title, tabs, activeTab, setActiveTab }) => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const currentRef = headerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-10 transition-all bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl font-bold mb-3 transition-all ${
            isScrolled ? "opacity-0 h-0" : "opacity-100 h-auto"
          }`}
        >
          {title}
        </h1>
        <HeaderTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </header>
  );
});
Header.displayName = "Header";

const JobTab: React.FC<{ status: Job['status']; searchQuery: string; setSearchQuery: (query: string) => void }> = React.memo(({ status, searchQuery, setSearchQuery }) => {
  const searchTerms = searchQuery.split(',').map(term => term.trim().toLowerCase());

  const filteredJobs = jobs
    .filter(job => job.status === status)
    .filter(job => 
      searchTerms.length === 0 || 
      searchTerms.some(term => job.jobName.toLowerCase().includes(term))
    );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search jobs (comma-separated for multiple)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredJobs.map((job) => (
        <LargeJobFrame 
          key={job.id}
          {...job} 
      />
    ))}
    </div>
  );
});
JobTab.displayName = "JobTab";

const NewTab = React.memo(() => {
  return (
    <div className="mx-auto space-y-4">
      <NewJobFrame />
    </div>
  );
});
NewTab.displayName = "NewTab";

const OverviewTab: React.FC<{ setActiveTab: (tab: string) => void; setSearchQuery: (query: string) => void }> = ({ setActiveTab, setSearchQuery }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const activeJobs = jobs.filter(job => job.status === 'active');

  const filteredJobs = activeJobs.filter(job => 
    job.jobName.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  const handleJobSelect = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleViewSelected = () => {
    if (selectedJobs.length > 0) {
      const selectedJobNames = selectedJobs.map(id => 
        jobs.find(job => job.id.toString() === id)?.jobName
      ).filter(Boolean);
      setActiveTab("Active");
      setSearchQuery(selectedJobNames.join(', '));
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search jobs..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={handleViewSelected}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
          disabled={selectedJobs.length === 0}
        >
          View Selected Jobs ({selectedJobs.length})
        </button>
      </div>

      <div className="flex justify-center items-center space-x-6 mb-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span className="">Overdue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span className="">&gt; 7 days</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span className="">Next 7 days</span>
        </div>
      </div>

      {filteredJobs.map((job) => (
        <JobFrame 
          key={job.id}
          id={job.id.toString()} 
          name={job.jobName} 
          overdue={job.overdue} 
          nextWeek={job.nextSevenDays} 
          laterWeeks={job.sevenDaysPlus} 
          isSelected={selectedJobs.includes(job.id.toString())}
          onSelect={handleJobSelect}
        />
      ))}
    </div>
  );
};

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState('');

  const headerTabs = [
    { name: "Overview", href: "#" },
    { name: "Active", href: "#" },
    { name: "Closed", href: "#" },
    { name: "Deleted", href: "#" },
    { name: "Create New", href: "#" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} />;
      case "Active":
        return <JobTab status="active" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case "Closed":
        return <JobTab status="closed" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case "Deleted":
        return <JobTab status="deleted" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case "Create New":
        return <NewTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <Header
          title="Jobs"
          tabs={headerTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import Timeline from '@/components/Timeline';
import ContentTabs from '@/components/ContentTabs';
import CardFrame from '@/components/CardFrame';
import PhaseCard from '@/components/PhaseCard';
import ContactCard from '@/components/ContactCard';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { JobDetailView, PhaseView, TaskView, MaterialView, UserView, Tab } from '../../types/views';


export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [job, setJob] = useState<JobDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        console.log('Raw API response:', data);
        
        const transformedJob: JobDetailView = {
          id: data.job.job_id,
          jobName: data.job.job_title,
          dateRange: data.job.date_range,
          currentWeek: data.job.current_week,
          phases: data.job.phases.map((phase: any): PhaseView => {
            const startDate = new Date(phase.startDate);
            const endDate = new Date(phase.endDate);
            
            return {
              id: phase.id,
              name: phase.name,
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              color: phase.color,
              tasks: phase.tasks.map((task: any): TaskView => ({
                task_id: task.task_id,
                task_title: task.task_title,
                task_startdate: new Date(task.task_startdate).toISOString().split('T')[0],
                task_duration: task.task_duration,
                task_status: task.task_status,
                task_description: task.task_description,
                users: task.users || []
              })),
              materials: phase.materials.map((material: any): MaterialView => ({
                material_id: material.material_id,
                material_title: material.material_title,
                material_duedate: new Date(material.material_duedate).toISOString().split('T')[0],
                material_status: material.material_status,
                material_description: material.material_description,
                users: material.users || []
              })),
              notes: phase.notes || []
            };
          }),
          overdue: data.job.overdue,
          nextSevenDays: data.job.nextSevenDays,
          sevenDaysPlus: data.job.sevenDaysPlus,
          tasks: data.job.tasks || [],
          materials: data.job.materials || [],
          workers: data.job.workers || []
        };
    
        setJob(transformedJob);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;
  
  const tabs: Tab[] = [
    { name: "Overview" },
    { name: "My Items" },
    { name: "Tasks" },
    { name: "Materials" },
    { name: "Floor Plan" },
    { name: "Contacts" }
  ];

  const renderPhaseCards = () => {
    return job.phases.map((phase: PhaseView, index: number) => (
      <PhaseCard
        key={phase.id}
        phase={{
          phase_id: phase.id,
          name: phase.name,
          startDate: phase.startDate,
          endDate: phase.endDate,
          tasks: phase.tasks,
          materials: phase.materials,
          notes: phase.notes
        }}
        phaseNumber={index + 1}
        showTasks={activeTab === "Overview" || activeTab === "My Items" || activeTab === "Tasks"}
        showMaterials={activeTab === "Overview" || activeTab === "My Items" || activeTab === "Materials"}
      />
    ));
  };

  const renderFloorPlan = () => {
    return (
      <CardFrame>
        <div 
          className="relative h-[400px] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src="/placeholder-floorplan.jpg"
            alt="Floor Plan"
            fill
            className="object-contain"
          />
        </div>

        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="text-lg font-semibold">Floor Plan</h3>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    // TODO: Implement download functionality with S3
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="relative h-[80vh] w-full">
                <Image
                  src="/placeholder-floorplan.jpg"
                  alt="Floor Plan"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          </div>
        )}
      </CardFrame>
    );
  };
  
  const renderContacts = () => {
    const allUsers = new Map<number, UserView>();
    
    job.phases.forEach(phase => {
      phase.tasks.forEach(task => {
        task.users.forEach(user => {
          allUsers.set(user.user_id, user);
        });
      });
      
      phase.materials.forEach(material => {
        material.users.forEach(user => {
          allUsers.set(user.user_id, user);
        });
      });
    });
  
    const uniqueUsers = Array.from(allUsers.values());
    const filteredUsers = uniqueUsers.filter(user => 
      user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_phone.includes(searchQuery)
    );
  
    return (
      <>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <ContactCard
              key={user.user_id}
              user_id={user.user_id}
              user_name={user.user_name}
              user_email={user.user_email}
              user_phone={user.user_phone}
            />
          ))}
        </div>
      </>
    );
  };

  const total = job.overdue + job.nextSevenDays + job.sevenDaysPlus;

  return (
    <>
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{job.jobName}</h1>
          <span className="text-lg">{job.dateRange}</span>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <CardFrame>
         <Timeline 
            phases={job.phases}
            currentWeek={job.currentWeek}
            startDate={job.phases[0]?.startDate}
            endDate={job.phases[job.phases.length - 1]?.endDate}
          />
        </CardFrame>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Job Status</h2>
        <CardFrame>
          <div className="flex items-center justify-center space-x-8 mb-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Overdue</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
              <span>Next 7 days</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              <span>&gt; 7 days</span>
            </div>
          </div>
          <div className="relative h-6">
            <div className="absolute inset-0 flex rounded-full overflow-hidden">
              <div 
                className="bg-red-500 flex items-center justify-center" 
                style={{width: `${(job.overdue / total) * 100}%`}}
              >
                <span className="text-xs font-bold text-white">{job.overdue}</span>
              </div>
              <div 
                className="bg-yellow-500 flex items-center justify-center" 
                style={{width: `${(job.nextSevenDays / total) * 100}%`}}
              >
                <span className="text-xs font-bold text-white">{job.nextSevenDays}</span>
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center" 
                style={{width: `${(job.sevenDaysPlus / total) * 100}%`}}
              >
                <span className="text-xs font-bold text-white">{job.sevenDaysPlus}</span>
              </div>
            </div>
          </div>
        </CardFrame>
      </section>

      <section className="mb-8">
        <ContentTabs 
          tabs={tabs}
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        <div className="mt-4">
          {activeTab === "Contacts" ? renderContacts() : 
           activeTab === "Floor Plan" ? renderFloorPlan() :
           renderPhaseCards()}
        </div>
      </section>
    </>
  );
}
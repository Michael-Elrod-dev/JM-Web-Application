"use client";

import React, { useState, useEffect } from "react";
import Timeline from "@/components/Timeline";
import ContentTabs from "@/components/ContentTabs";
import CardFrame from "@/components/CardFrame";
import PhaseCard from "@/components/PhaseCard";
import ContactCard from "@/components/ContactCard";
import Image from "next/image";
import { JobUpdatePayload } from "@/app/types/database";
import { useParams } from "next/navigation";
import {
  JobDetailView,
  PhaseView,
  TaskView,
  MaterialView,
  UserView,
  Tab,
} from "../../types/views";

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [editJobTitle, setEditJobTitle] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [extensionDays, setExtensionDays] = useState<number>(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [job, setJob] = useState<JobDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"edit" | "floorplan" | null>(
    null
  );

  useEffect(() => {
    if (activeModal === "edit" && job) {
      setEditJobTitle(job.jobName);
      setEditStartDate(new Date(job.job_startdate).toISOString().split("T")[0]);
    }
  }, [activeModal, job]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        console.log("Raw API response:", data);

        const transformedJob: JobDetailView = {
          id: data.job.job_id,
          jobName: data.job.job_title,
          job_startdate: data.job.job_startdate,
          dateRange: data.job.date_range,
          currentWeek: data.job.current_week,
          phases: data.job.phases.map((phase: any): PhaseView => {
            return {
              id: phase.id,
              name: phase.name,
              startDate: phase.startDate,
              endDate: phase.endDate,
              color: phase.color,
              tasks: phase.tasks.map(
                (task: any): TaskView => ({
                  task_id: task.task_id,
                  task_title: task.task_title,
                  task_startdate: new Date(task.task_startdate)
                    .toISOString()
                    .split("T")[0],
                  task_duration: task.task_duration,
                  task_status: task.task_status,
                  task_description: task.task_description,
                  users: task.users.map((user: any) => ({
                    user_id: user.user_id,
                    first_name: user.user_first_name,
                    last_name: user.user_last_name,
                    user_email: user.user_email,
                    user_phone: user.user_phone || "",
                  })),
                })
              ),

              materials: phase.materials.map(
                (material: any): MaterialView => ({
                  material_id: material.material_id,
                  material_title: material.material_title,
                  material_duedate: new Date(material.material_duedate)
                    .toISOString()
                    .split("T")[0],
                  material_status: material.material_status,
                  material_description: material.material_description,
                  users: material.users.map((user: any) => ({
                    user_id: user.user_id,
                    first_name: user.user_first_name,
                    last_name: user.user_last_name,
                    user_email: user.user_email,
                    user_phone: user.user_phone || "",
                  })),
                })
              ),
              notes: phase.notes || [],
            };
          }),
          overdue: data.job.overdue,
          nextSevenDays: data.job.nextSevenDays,
          sevenDaysPlus: data.job.sevenDaysPlus,
          tasks: data.job.tasks || [],
          materials: data.job.materials || [],
          workers: data.job.workers || [],
        };

        setJob(transformedJob);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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
    { name: "Contacts" },
  ];

  const handleSaveJobChanges = async () => {
    if (!job) return;

    const changes: JobUpdatePayload = {};
    let hasChanges = false;

    if (editJobTitle !== job.jobName) {
      changes.job_title = editJobTitle;
      hasChanges = true;
    }

    const originalStartDate = new Date(job.phases[0].startDate)
      .toISOString()
      .split("T")[0];
    if (editStartDate !== originalStartDate) {
      changes.job_startdate = editStartDate;
      hasChanges = true;
    }

    if (extensionDays > 0) {
      changes.extension_days = extensionDays;
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        const response = await fetch(`/api/jobs/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        });

        if (!response.ok) {
          throw new Error("Failed to update job");
        }

        // Close modal and refresh page
        setActiveModal(null);
        window.location.reload();
      } catch (error) {
        console.error("Error updating job:", error);
      }
    } else {
      setActiveModal(null);
    }
  };

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
          notes: phase.notes,
        }}
        phaseNumber={index + 1}
        showTasks={
          activeTab === "Overview" ||
          activeTab === "My Items" ||
          activeTab === "Tasks"
        }
        showMaterials={
          activeTab === "Overview" ||
          activeTab === "My Items" ||
          activeTab === "Materials"
        }
      />
    ));
  };

  const renderFloorPlan = () => {
    return (
      <CardFrame>
        <div
          className="relative h-[400px] cursor-pointer"
          onClick={() => setActiveModal("floorplan")}
        >
          <Image
            src="/placeholder-floorplan.jpg"
            alt="Floor Plan"
            fill
            className="object-contain"
          />
        </div>
      </CardFrame>
    );
  };

  const renderContacts = () => {
    const allUsers = new Map<number, UserView>();

    job.phases.forEach((phase) => {
      phase.tasks.forEach((task) => {
        task.users.forEach((user) => {
          allUsers.set(user.user_id, user);
        });
      });

      phase.materials.forEach((material) => {
        material.users.forEach((user) => {
          allUsers.set(user.user_id, user);
        });
      });
    });

    const uniqueUsers = Array.from(allUsers.values());
    const filteredUsers = uniqueUsers.filter(
      (user) =>
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
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
              user_first_name={user.first_name}
              user_last_name={user.last_name}
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
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{job.jobName}</h1>
            <span className="text-lg text-gray-600">{job.dateRange}</span>
          </div>
          <button
            onClick={() => setActiveModal("edit")}
            className="px-4 py-2 bg-gray-500 text-white rounded font-bold hover:bg-gray-600 transition-colors"
          >
            Edit
          </button>
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
              <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
              <span>Overdue</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
              <span>Next 7 days</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
              <span>&gt; 7 days</span>
            </div>
          </div>
          <div className="relative h-6">
            <div className="absolute inset-0 flex rounded-full overflow-hidden">
              <div
                className="bg-red-500 flex items-center justify-center"
                style={{ width: `${(job.overdue / total) * 100}%` }}
              >
                {job.overdue > 0 && (
                  <span className="text-xs font-bold text-white">
                    {job.overdue}
                  </span>
                )}
              </div>
              <div
                className="bg-yellow-500 flex items-center justify-center"
                style={{ width: `${(job.nextSevenDays / total) * 100}%` }}
              >
                {job.nextSevenDays > 0 && (
                  <span className="text-xs font-bold text-white">
                    {job.nextSevenDays}
                  </span>
                )}
              </div>
              <div
                className="bg-green-500 flex items-center justify-center"
                style={{ width: `${(job.sevenDaysPlus / total) * 100}%` }}
              >
                {job.sevenDaysPlus > 0 && (
                  <span className="text-xs font-bold text-white">
                    {job.sevenDaysPlus}
                  </span>
                )}
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
          {activeTab === "Contacts"
            ? renderContacts()
            : activeTab === "Floor Plan"
            ? renderFloorPlan()
            : renderPhaseCards()}
        </div>
      </section>

      {/* Floor Plan Modal */}
      {activeModal === "floorplan" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveModal(null);
            }
          }}
        >
          <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold">Floor Plan</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Download
                </button>
                <button
                  onClick={() => setActiveModal(null)}
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

      {/* Edit Job Modal */}
      {activeModal === "edit" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveModal(null);
            }
          }}
        >
          <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-2xl w-full overflow-hidden relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Job</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Job Title Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                    value={editJobTitle}
                    onChange={(e) => setEditJobTitle(e.target.value)}
                  />
                </div>

                {/* Start Date Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>

                {/* Extend Job Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adjust Job Timeline (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                    value={extensionDays}
                    onChange={(e) =>
                      setExtensionDays(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveJobChanges}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

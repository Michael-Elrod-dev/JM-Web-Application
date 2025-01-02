"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardFrame from "../../../components/CardFrame";
import NewJobCard from "../../../components/new/NewJobCard";
import PhaseCard from "../../../components/new/NewPhaseCard";
import { FormPhase, User } from "@/app/types/database";
import {
  handleInputChange,
  handleCreateJob,
  handlePhaseUpdate,
  getJobTypes,
} from "../../../handlers/new/jobs";
import { createJob, transformFormDataToNewJob } from "../../../handlers/jobs";

export default function NewJobPage() {
  const router = useRouter();
  type JobType = string;
  const jobTypes = getJobTypes();
  const [jobType, setJobType] = useState<string>("");
  const [phases, setPhases] = useState<FormPhase[]>([]);
  const [showNewJobCard, setShowNewJobCard] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [contacts, setContacts] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const isCreateJobDisabled = !jobType || !startDate;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/users/non-clients");
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    jobLocation: "",
    description: "",
    selectedClient: null as { user_id: number } | null,
  });

  const handleSubmitJob = async () => {
    try {
      setIsSubmitting(true);

      // Enhanced validation
      if (!jobDetails.jobTitle.trim()) {
        throw new Error("Job title is required");
      }

      if (!startDate) {
        throw new Error("Start date is required");
      }

      const formData = {
        jobTitle: jobDetails.jobTitle.trim(),
        startDate,
        jobLocation: jobDetails.jobLocation?.trim() || "",
        description: jobDetails.description?.trim() || "",
        selectedClient: jobDetails.selectedClient,
        phases: phases.map((phase) => ({
          title: phase.title.trim(),
          startDate: phase.startDate,
          description: phase.description?.trim() || "",
          tasks: phase.tasks.map((task) => ({
            title: task.title.trim(),
            startDate: task.startDate,
            duration: task.duration.toString(),
            details: task.details?.trim() || "",
            selectedContacts: task.selectedContacts || [],
          })),
          materials: phase.materials.map((material) => ({
            ...material,
            title: material.title.trim(),
            details: material.details?.trim() || "",
            selectedContacts: material.selectedContacts || [],
          })),
          notes: phase.notes.map((note) => ({
            ...note,
            content: note.content.trim(),
          })),
        })),
      };

      console.log("Form Data:", formData);

      const jobData = transformFormDataToNewJob(formData);
      console.log("Transformed Job Data:", jobData);

      const response = await createJob(jobData);

      if (!response.jobId) {
        throw new Error("Failed to get job ID from server");
      }

      router.push(`/jobs/${response.jobId}`);
    } catch (error) {
      console.error("Error creating job:", error);
      // Could add error state here to display to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto space-y-4">
      {!showNewJobCard ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-left mb-2">Create Template</h2>
          <CardFrame>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-zinc-700 dark:text-white"
                >
                  Job Type
                </label>
                <select
                  id="jobType"
                  className="mt-1 w-full border rounded-md shadow-sm p-2 text-zinc-500 border-zinc-300 dark:text-zinc-400 dark:bg-zinc-800 dark:border-zinc-600 h-[44px]"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="" disabled>
                    Choose Job Type
                  </option>
                  {jobTypes.map((type: JobType) => (
                    <option
                      key={type}
                      className="text-zinc-700 dark:text-white"
                      value={type}
                    >
                      {type
                        .split("-")
                        .map(
                          (word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-zinc-700 dark:text-white"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value, setStartDate)
                  }
                  min={today}
                  className="mt-1 w-full border rounded-md shadow-sm p-2 text-zinc-700 dark:text-white border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600"
                  required
                />
              </div>
            </div>
          </CardFrame>

          <div className="flex justify-end">
            <button
              className={`px-6 py-2 text-white font-bold rounded-md transition-colors ${
                isCreateJobDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={() =>
                handleCreateJob(
                  jobType,
                  startDate,
                  setShowNewJobCard,
                  setPhases
                )
              }
              disabled={isCreateJobDisabled}
            >
              Create Job
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl mb-4">
            <span className="font-bold">
              Job Type -{" "}
              {jobType
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>{" "}
            {new Date(startDate).toLocaleDateString()}
          </h2>

          <NewJobCard
            jobType={jobType}
            startDate={startDate}
            onJobDetailsChange={({
              jobTitle,
              jobLocation,
              description,
              selectedClient,
            }) => {
              setJobDetails({
                jobTitle,
                jobLocation: jobLocation || "",
                description: description || "",
                selectedClient: selectedClient || null,
              });
            }}
          />

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold">Phases</h2>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <PhaseCard
                  key={phase.tempId}
                  phase={phase}
                  onDelete={() => {
                    const newPhases = phases.filter((_, i) => i !== index);
                    setPhases(newPhases);
                  }}
                  jobStartDate={startDate}
                  onUpdate={(updatedPhase) =>
                    handlePhaseUpdate(updatedPhase, setPhases)
                  }
                  contacts={contacts.map((user) => ({
                    user_id: user.user_id,
                    first_name: user.user_first_name,
                    last_name: user.user_last_name,
                    user_email: user.user_email,
                    user_phone: user.user_phone || "",
                  }))}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 mb-8 flex justify-end gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-white font-bold rounded-md shadow-lg bg-zinc-500 hover:bg-zinc-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSubmitJob}
              disabled={isSubmitting || !jobDetails.jobTitle}
              className={`px-6 py-3 text-white font-bold rounded-md shadow-lg transition-colors ${
                isSubmitting || !jobDetails.jobTitle
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              title={!jobDetails.jobTitle ? "Job title is required" : ""}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Job...
                </span>
              ) : (
                "Create Job"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

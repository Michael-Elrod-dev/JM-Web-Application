"use client";

import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import CardFrame from "../../../components/CardFrame";
import JobButton from "../../../components/JobButton";
import PhaseCard from "../../../components/new/NewPhaseCard";
import ClientSearchSelect from "../../../components/new/ClientSearch";
import { FaPlus } from "react-icons/fa";
import { User, FormPhase } from "../../types/database";
import {
  handleAddPhase,
  handleDeletePhase,
  handleCancel,
  createJob,
  transformFormDataToNewJob,
} from "../../../handlers/jobs";

export default function NewJobPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [jobTitle, setJobTitle] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phases, setPhases] = useState<FormPhase[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getInputClassName = (fieldName: string) => {
    const baseClass = "mt-1 block w-full border rounded-md shadow-sm p-2";
    const errorClass = "border-red-500";
    const normalClass = "border-zinc-300";

    return `${baseClass} ${
      attempted && errors[fieldName] ? errorClass : normalClass
    }`;
  };

  const handleCreate = async () => {
    // Validate required fields
    const errors: { [key: string]: string } = {};
    if (!jobTitle.trim()) errors.jobTitle = "Title is required";
    if (!startDate) errors.startDate = "Start date is required";
    if (!selectedClient && !showNewClientForm)
      errors.client = "Client is required";
    if (showNewClientForm) {
      if (!clientName.trim()) errors.clientName = "Client name is required";
      if (!clientEmail.trim()) errors.clientEmail = "Client email is required";
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAttempted(true);
      return;
    }

    // Prepare form data for transformation
    const formData = {
      jobTitle,
      startDate,
      jobLocation,
      description,
      selectedClient,
      clientName,
      clientEmail,
      clientPhone,
      phases: phases.map((phase) => ({
        title: phase.title,
        startDate: phase.startDate,
        description: phase.description,
        tasks: phase.tasks.map((task) => ({
          title: task.title,
          startDate: task.startDate,
          duration: task.duration,
          details: task.details,
          selectedContacts: task.selectedContacts,
        })),
        materials: phase.materials.map((material) => ({
          title: material.title,
          dueDate: material.dueDate,
          details: material.details,
          selectedContacts: material.selectedContacts,
        })),
        notes: phase.notes.map((note) => ({
          content: note.content,
        })),
      })),
    };

    try {
      const jobData = transformFormDataToNewJob(formData);
      const result = await createJob(jobData);
      router.push(`/jobs/${result.jobId}`);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    }
  };

  const handlePhaseUpdate = useCallback((updatedPhase: FormPhase) => {
    setPhases((prevPhases) =>
      prevPhases.map((p) =>
        p.tempId === updatedPhase.tempId ? updatedPhase : p
      )
    );
  }, []);

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "jobTitle":
        setJobTitle(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="mx-auto space-y-4">
      <CardFrame>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-zinc-700 dark:text-white"
            >
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              className={getInputClassName("jobTitle")}
              placeholder="Job title..."
              required
            />
            {attempted && errors.jobTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-zinc-700 dark:text-white"
              >
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                min={today}
                className={`${getInputClassName(
                  "startDate"
                )} [color-scheme:light] text-zinc-900 dark:text-white placeholder-zinc-500 [&:not(:valid)]:text-zinc-500 h-[38px]`}
                required
              />
              {attempted && errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="jobLocation"
                className="block text-sm font-medium text-zinc-700 dark:text-white"
              >
                Job Location
              </label>
              <input
                type="text"
                id="jobLocation"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2 h-[38px]"
                placeholder="Address where the property is located..."
              />
            </div>
            <div>
              <label
                htmlFor="jobImage"
                className="block text-sm font-medium text-zinc-700 dark:text-white"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="jobImage"
                accept="image/*"
                className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm px-2 h-[38px]
        file:mr-4 file:py-0.5 file:px-4 file:rounded-md file:border-0 
        file:text-sm file:font-bold 
        file:bg-zinc-500 file:text-white 
        hover:file:bg-zinc-700 
        file:transition-colors
        file:h-[26px] file:mt-[4px]
        text-zinc-500
        placeholder:text-zinc-500
        [&:not(:placeholder-shown)]:text-zinc-900
        dark:text-zinc-400 
        dark:[&:not(:placeholder-shown)]:text-white"
                placeholder="No file chosen..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {!showNewClientForm ? (
                <ClientSearchSelect
                  onClientSelect={(client: User | null) => {
                    setSelectedClient(client);
                    if (client) {
                      setClientName(client.user_name);
                      setClientPhone(client.user_phone || "");
                      setClientEmail(client.user_email);
                    }
                  }}
                />
              ) : (
                <div className="flex-grow grid grid-cols-3 gap-4 h-[64px]">
                  <div>
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-medium text-zinc-700 dark:text-white"
                    >
                      Client Name
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                      placeholder="Name Here"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="clientPhone"
                      className="block text-sm font-medium text-zinc-700 dark:text-white"
                    >
                      Client Phone Number
                    </label>
                    <input
                      type="tel"
                      id="clientPhone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                      placeholder="999-999-9999"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="clientEmail"
                      className="block text-sm font-medium text-zinc-700 dark:text-white"
                    >
                      Client Email
                    </label>
                    <input
                      type="email"
                      id="clientEmail"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
                      placeholder="client@gmail.com"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowNewClientForm(!showNewClientForm);
                  if (!showNewClientForm) {
                    setSelectedClient(null);
                    setClientName("");
                    setClientPhone("");
                    setClientEmail("");
                  }
                }}
                className="mt-6 px-4 py-2 bg-zinc-500 text-white font-bold rounded-md hover:bg-zinc-700 transition-colors"
              >
                {showNewClientForm ? "Select Client" : "Add New Client"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2"
              placeholder="This is a detailed or high level description of the job..."
            />
          </div>
        </div>
      </CardFrame>

      {phases.map((phase, index) => (
        <PhaseCard
          key={phase.tempId}
          phase={phase}
          phaseNumber={index + 1}
          onDelete={() => handleDeletePhase(index, phases, setPhases)}
          jobStartDate={startDate}
          onUpdate={handlePhaseUpdate}
        />
      ))}

      <div className="flex justify-end space-x-4 mt-4 w-full">
        <JobButton
          title="Add a Phase"
          icon={FaPlus}
          onClick={() => {
            setAttempted(true);
            const newErrors: { [key: string]: string } = {};
            if (!jobTitle.trim()) newErrors.jobTitle = "Title is required";
            if (!startDate) newErrors.startDate = "Start date is required";
            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
              handleAddPhase(phases, setPhases, startDate);
            }
          }}
          color="default"
        />
        <JobButton title="Save Job" onClick={handleCreate} color="green" />
        <JobButton
          title="Cancel"
          onClick={() =>
            handleCancel(
              setJobTitle,
              setClientName,
              setClientPhone,
              setClientEmail,
              setStartDate,
              setJobLocation,
              setDescription,
              setPhases,
              setSelectedClient,
              setShowNewClientForm
            )
          }
          color="red"
        />
      </div>
    </div>
  );
}

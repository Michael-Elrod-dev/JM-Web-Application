"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import CardFrame from "../../../components/CardFrame";
import JobButton from "../../../components/JobButton";
import PhaseCard from "../../../components/new/NewPhaseCard";
import ClientSearchSelect from "../../../components/new/ClientSearch";
import { FaPlus } from "react-icons/fa";
import { UserType } from "../../types/database";
import { User, FormPhase } from "../../types/database";
import { UserView } from "../../types/views";


import {
  handleAddPhase,
  handleDeletePhase,
  handleCancel,
  createJob,
  transformFormDataToNewJob,
} from "../../../handlers/jobs";

export default function NewJobPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<UserView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [jobTitle, setJobTitle] = useState("");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phases, setPhases] = useState<FormPhase[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getInputClassName = (fieldName: string, type: string = "text") => {
    const baseClass = "mt-1 block w-full border rounded-md shadow-sm p-2";
    const errorClass = "border-red-500";
    const normalClass = "border-zinc-300";
    const darkModeClass =
      "dark:bg-zinc-800 dark:text-white dark:border-zinc-600";

    const typeSpecificClass =
      type === "file"
        ? `file:mr-4 file:py-0.5 file:px-4 file:rounded-md file:border-0 
         file:text-sm file:font-bold file:bg-zinc-500 file:text-white 
         hover:file:bg-zinc-700 file:transition-colors file:h-[26px] file:mt-[4px]`
        : "";

    return `${baseClass} ${
      attempted && errors[fieldName] ? errorClass : normalClass
    } 
            ${darkModeClass} ${typeSpecificClass}`.trim();
  };

  const handleCreate = async () => {
    // Validate required fields
    const errors: { [key: string]: string } = {};
    if (!jobTitle.trim()) errors.jobTitle = "Title is required";
    if (!startDate) errors.startDate = "Start date is required";
    if (!selectedClient && !showNewClientForm)
      errors.client = "Client is required";
    if (showNewClientForm) {
      if (!firstName.trim()) errors.firstName = "First name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
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
      client: {
        user_first_name: firstName,
        user_last_name: lastName,
        user_email: clientEmail,
        user_phone: clientPhone || null,
        user_type: "Client" as UserType,
      },
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

  const validateClientForm = () => {
    const errors: { [key: string]: string } = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!clientEmail.trim()) errors.clientEmail = "Client email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }
    return errors;
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";
    if (numbers.length <= 3) {
      return `(${numbers}`;
    }
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    }
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
      6,
      10
    )}`;
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/users/workers');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
  
    fetchContacts();
  }, []);

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
                className={getInputClassName("startDate", "date")}
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
                className={getInputClassName("jobLocation")}
                placeholder="Address..."
              />
            </div>
            <div>
              <label
                htmlFor="jobImage"
                className="block text-sm font-medium text-zinc-700 dark:text-white"
              >
                Upload Floorplan
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="jobImage"
                  accept="image/*"
                  className={`${getInputClassName(
                    "jobImage",
                    "file"
                  )} custom-file-input opacity-0 absolute inset-0 w-full h-full cursor-pointer`}
                />
                <div
                  className={`${getInputClassName(
                    "jobImage"
                  )} pointer-events-none text-zinc-500 dark:text-zinc-400`}
                >
                  Click to upload image...
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <ClientSearchSelect
                  onClientSelect={(client: User | null) => {
                    setSelectedClient(client);
                    if (client) {
                      setFirstName(client.user_first_name);
                      setLastName(client.user_last_name);
                      setClientPhone(client.user_phone || "");
                      setClientEmail(client.user_email);
                    }
                  }}
                  selectedClient={selectedClient}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowNewClientForm(true)}
                className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New Client
              </button>
            </div>
          </div>

          {showNewClientForm && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowNewClientForm(false);
                  setFirstName("");
                  setLastName("");
                  setClientPhone("");
                  setClientEmail("");
                  setErrors({});
                }
              }}
            >
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-[500px]">
                <h2 className="text-xl font-bold mb-4">Add New Client</h2>
                {errors.submit && (
                  <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
                )}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-white">
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 ${
                          attempted && errors.firstName
                            ? "border-red-500"
                            : "border-zinc-300"
                        }`}
                        placeholder="First Name"
                        required
                      />
                      {attempted && errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-white">
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 ${
                          attempted && errors.lastName
                            ? "border-red-500"
                            : "border-zinc-300"
                        }`}
                        placeholder="Last Name"
                        required
                      />
                      {attempted && errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-white">
                      Client Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className={`mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 ${
                        attempted && errors.clientEmail
                          ? "border-red-500"
                          : "border-zinc-300"
                      }`}
                      placeholder="client@gmail.com"
                      required
                    />
                    {attempted && errors.clientEmail && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.clientEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-white">
                      Client Phone Number
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => {
                        // Only update if the new value would be a valid phone number
                        const formatted = formatPhoneNumber(e.target.value);
                        if (formatted.length <= 14) {
                          // (XXX) XXX-XXXX = 14 characters
                          setClientPhone(formatted);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow backspace to work naturally
                        if (e.key === "Backspace" && clientPhone.length === 1) {
                          setClientPhone("");
                        }
                      }}
                      className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm p-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
                      placeholder="(999) 999-9999"
                      maxLength={14}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        setShowNewClientForm(false);
                        setFirstName("");
                        setLastName("");
                        setClientPhone("");
                        setClientEmail("");
                        setErrors({});
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const newErrors = validateClientForm();
                      setErrors(newErrors);
                      setAttempted(true);

                      if (Object.keys(newErrors).length === 0) {
                        setIsLoading(true);
                        try {
                          // Create new client
                          const response = await fetch("/api/users/clients", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              firstName: firstName,
                              lastName: lastName,
                              email: clientEmail,
                              phone: clientPhone.replace(/\D/g, ""),
                            }),
                          });

                          const newClient = await response.json();

                          if (!response.ok) {
                            throw new Error(
                              newClient.error || "Failed to create client"
                            );
                          }

                          // Format the client object to match User type
                          const formattedClient: User = {
                            user_id: newClient.user_id,
                            user_first_name: newClient.user_first_name,
                            user_last_name: newClient.user_last_name,
                            user_email: newClient.user_email,
                            user_phone: newClient.user_phone,
                            user_type: "Client" as UserType,
                            created_at: newClient.created_at,
                            updated_at: newClient.updated_at,
                          };

                          // Update selected client
                          setSelectedClient(formattedClient);

                          // Force refresh of client list by triggering a new search
                          const refreshResponse = await fetch(
                            "/api/users/clients"
                          );
                          if (!refreshResponse.ok) {
                            throw new Error("Failed to refresh client list");
                          }

                          // Now close modal and reset states
                          setShowNewClientForm(false);
                          setAttempted(false);
                          setFirstName("");
                          setLastName("");
                          setClientPhone("");
                          setClientEmail("");
                          setErrors({});
                        } catch (error) {
                          setErrors({
                            submit:
                              error instanceof Error
                                ? error.message
                                : "Failed to create client",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-700 transition-colors flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
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
                        Creating...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

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
              className={getInputClassName("description")}
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
          contacts={contacts}
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
          color="blue"
        />
        <JobButton title="Save Job" onClick={handleCreate} color="green" />
        <JobButton
          title="Cancel"
          onClick={() =>
            handleCancel(
              setJobTitle,
              setFirstName,
              setLastName,
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

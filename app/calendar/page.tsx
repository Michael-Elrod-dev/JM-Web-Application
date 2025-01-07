"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { Job, Phase } from "../types/database";
import {
  CalendarEvent,
  SelectedEventInfo,
  EventPopup,
} from "../../components/calendar/EventPopup";
import { Legend } from "../../components/calendar/Legend";

const phaseColors = [
  "#3498db", // blue
  "#2ecc71", // green
  "#e74c3c", // red
  "#9b59b6", // purple
  "#f1c40f", // yellow
  "#1abc9c", // turquoise
  "#e67e22", // orange
  "#34495e", // navy
];

const jobColors = [
  "#FF6B6B", // red
  "#4ECDC4", // teal
  "#45B7D1", // blue
  "#96CEB4", // green
  "#FFEEAD", // yellow
  "#D4A5A5", // pink
  "#9B59B6", // purple
  "#3498DB", // light blue
];

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEventInfo | null>(
    null
  );
  const [legendItems, setLegendItems] = useState<
    Array<{ label: string; color: string }>
  >([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/calendar");
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          setSelectedJobId(null);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const updateEventStatus = (
    itemId: number,
    type: "task" | "material",
    newStatus: "Complete" | "Incomplete"
  ) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id === `${type}-${itemId}` && event.extendedProps) {
          return {
            ...event,
            extendedProps: {
              ...event.extendedProps,
              type: event.extendedProps.type,
              itemId: event.extendedProps.itemId,
              status: newStatus,
            },
          };
        }
        return event;
      })
    );
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .fc-more-popover {
        background-color: white !important;
      }
  
      .dark .fc-more-popover {
        background-color: rgb(17, 24, 39) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (selectedJobId) {
          const response = await fetch(`/api/calendar?jobId=${selectedJobId}`);
          const data = await response.json();

          const phaseLegendItems =
            data.phases?.map((phase: any, index: number) => ({
              label: phase.phase_title,
              color: phaseColors[index % phaseColors.length],
            })) || [];

          setLegendItems(phaseLegendItems);

          const calendarEvents: CalendarEvent[] = [];

          data.phases?.forEach((phase: any, phaseIndex: number) => {
            const phaseColor = phaseColors[phaseIndex % phaseColors.length];

            phase.tasks?.forEach((task: any) => {
              const startDate = new Date(task.task_startdate);
              const endDate = new Date(startDate);
              let daysToAdd = task.task_duration;
              let currentDay = 0;

              while (currentDay < daysToAdd) {
                endDate.setDate(endDate.getDate() + 1);
                if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
                  currentDay++;
                }
              }

              calendarEvents.push({
                id: `task-${task.task_id}`,
                title: task.task_title,
                start: task.task_startdate.split("T")[0],
                end: endDate.toISOString().split("T")[0],
                color: phaseColor,
                order: 1,
                display: "block",
                extendedProps: {
                  phaseId: phase.phase_id,
                  type: "task",
                  duration: task.task_duration,
                  status: task.task_status,
                  itemId: task.task_id,
                  description: task.task_description,
                  contacts: task.assigned_users,
                },
              });
            });

            phase.materials?.forEach((material: any) => {
              calendarEvents.push({
                id: `material-${material.material_id}`,
                title: material.material_title,
                start: material.material_duedate.toString().split("T")[0],
                color: phaseColor,
                order: 2,
                allDay: true,
                display: "list-item",
                extendedProps: {
                  type: "material",
                  status: material.material_status,
                  itemId: material.material_id,
                  description: material.material_description,
                  contacts: material.assigned_users,
                },
              });
            });
          });

          setEvents(calendarEvents);
        } else {
          const responses = await Promise.all(
            jobs.map((job) => fetch(`/api/calendar?jobId=${job.job_id}`))
          );
          const jobsData = await Promise.all(responses.map((r) => r.json()));

          const jobLegendItems = jobs.map((job, index) => ({
            label: job.job_title,
            color: jobColors[index % jobColors.length],
          }));
          setLegendItems(jobLegendItems);

          const allEvents: CalendarEvent[] = [];
          jobsData.forEach((jobData, jobIndex) => {
            const jobColor = jobColors[jobIndex % jobColors.length];

            jobData.phases?.forEach((phase: any) => {
              phase.tasks?.forEach((task: any) => {
                const startDate = new Date(task.task_startdate);
                const endDate = new Date(startDate);
                let daysToAdd = task.task_duration;
                let currentDay = 0;

                while (currentDay < daysToAdd) {
                  endDate.setDate(endDate.getDate() + 1);
                  if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
                    currentDay++;
                  }
                }

                allEvents.push({
                  id: `task-${task.task_id}`,
                  title: `${jobData.job_title}: ${task.task_title}`,
                  start: task.task_startdate.split("T")[0],
                  end: endDate.toISOString().split("T")[0],
                  color: jobColor,
                  order: 1,
                  display: "block",
                  extendedProps: {
                    type: "task",
                    duration: task.task_duration,
                    status: task.task_status,
                    itemId: task.task_id,
                    description: task.task_description,
                    contacts: task.assigned_users,
                  },
                });
              });

              phase.materials?.forEach((material: any) => {
                allEvents.push({
                  id: `material-${material.material_id}`,
                  title: `${jobData.job_title}: ${material.material_title}`,
                  start: material.material_duedate.toString().split("T")[0],
                  color: jobColor,
                  order: 2,
                  allDay: true,
                  display: "list-item",
                  extendedProps: {
                    type: "material",
                    status: material.material_status,
                    itemId: material.material_id,
                    description: material.material_description,
                    contacts: material.assigned_users,
                  },
                });
              });
            });
          });

          setEvents(allEvents);
        }
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      }
    };

    fetchJobDetails();
  }, [selectedJobId, jobs]);

  const renderEventContent = (eventInfo: EventContentArg) => {
    const isComplete = eventInfo.event.extendedProps.status === "Complete";
  
    return (
      <div
        style={{
          padding: "2px",
          overflow: "hidden",
          cursor: "pointer",
          textDecoration: isComplete ? "line-through" : "none",
          opacity: isComplete ? 0.5 : 1,
        }}
        className="hover:opacity-75 transition-opacity"
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "0.85em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {eventInfo.event.title}
        </div>
        {!eventInfo.event.allDay && eventInfo.timeText && (
          <div style={{ fontSize: "0.75em", opacity: 0.7 }}>
            {eventInfo.timeText}
          </div>
        )}
      </div>
    );
  };
  

  return (
    <div className="flex-1">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold mb-4">Calendar</h1>
        <select
          value={selectedJobId || ""}
          onChange={(e) =>
            setSelectedJobId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-64 mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.job_id} value={job.job_id}>
              {job.job_title}
            </option>
          ))}
        </select>
      </div>

      <Legend items={legendItems} />

      <div style={{ height: "calc(100vh - 200px)", padding: "16px" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          views={{
            dayGridWeek: {
              dayHeaderFormat: {
                weekday: "short",
                month: "numeric",
                day: "numeric",
              },
              dayMinWidth: 120,
            },
            dayGridDay: {
              dayHeaderFormat: {
                weekday: "long",
                month: "long",
                day: "numeric",
              },
            },
          }}
          weekends={false}
          eventDisplay="block"
          events={events}
          eventContent={renderEventContent}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          displayEventEnd={true}
          dayMaxEvents={5}
          eventOrder="order,title"
          eventOrderStrict={true}
          eventClick={(info) => {
            setSelectedEvent({
              title: info.event.title,
              start: info.event.startStr,
              type: info.event.extendedProps.type,
              duration: info.event.extendedProps.duration,
              phaseId: info.event.extendedProps.phaseId,
              status: info.event.extendedProps.status,
              itemId: info.event.extendedProps.itemId,
              description: info.event.extendedProps.description,
              contacts: info.event.extendedProps.contacts,
            });
            setShowPopup(true);
          }}
          height="100%"
        />
      </div>

      {showPopup && selectedEvent && (
        <EventPopup
          event={selectedEvent}
          onClose={() => {
            setShowPopup(false);
            setSelectedEvent(null);
          }}
          onStatusUpdate={updateEventStatus}
        />
      )}
    </div>
  );
}

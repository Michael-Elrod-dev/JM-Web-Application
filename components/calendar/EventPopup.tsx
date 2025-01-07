// components/EventPopup.tsx
import React from "react";

export interface CalendarEvent {
  id: string;
  order: number;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  display?: string;
  extendedProps: {
    phaseId?: number;
    type: "task" | "material";
    duration?: number;
    status: "Complete" | "Incomplete";
    itemId: number;
    description?: string;
    contacts?: Array<{
      firstName: string;
      lastName: string;
      email: string;
    }>;
  };
}

export interface SelectedEventInfo {
  title: string;
  start: string;
  end?: string;
  phaseId?: number;
  type: "task" | "material";
  duration?: number;
  status: "Complete" | "Incomplete";
  itemId: number;
  description?: string;
  contacts?: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

interface EventPopupProps {
  event: SelectedEventInfo;
  onClose: () => void;
  onStatusUpdate: (
    itemId: number,
    type: "task" | "material",
    newStatus: "Complete" | "Incomplete"
  ) => void;
}

export const EventPopup = ({
  event,
  onClose,
  onStatusUpdate,
}: EventPopupProps) => {
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleStatusToggle = async () => {
    const newStatus = event.status === "Complete" ? "Incomplete" : "Complete";

    try {
      const response = await fetch(
        `/api/calendar?type=${event.type}&id=${event.itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        onStatusUpdate(event.itemId, event.type, newStatus);
        event.status = newStatus;
        onClose();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getWeekdayDateRange = (start: Date, durationDays: number) => {
    const dates = [];
    let currentDate = new Date(start);
    let remainingDays = durationDays;

    while (remainingDays > 0) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(new Date(currentDate));
        remainingDays--;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      start: dates[0],
      end: dates[dates.length - 1],
    };
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full m-4"
        onClick={handlePopupClick}
      >
        <div className="space-y-4">
          {/* Title as Header */}
          <h2 className="text-xl font-bold text-zinc-700 dark:text-white">{event.title}</h2>
          {/* Date Range Section */}
          <div>
            <h3 className="font-semibold text-zinc-700 dark:text-white mb-2">Date Range</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              {event.type === "task" ? (
                event.start && event.duration ? (
                  (() => {
                    const dateRange = getWeekdayDateRange(
                      new Date(event.start),
                      event.duration
                    );
                    return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
                  })()
                ) : (
                  "Date range not available"
                )
              ) : (
                `Due: ${new Date(event.start).toLocaleDateString()}`
              )}
            </p>
          </div>
  
          {/* Status Section */}
          <div>
            <h3 className="font-semibold text-zinc-700 dark:text-white mb-2">Status</h3>
            <p className="text-zinc-600 dark:text-zinc-300">{event.status}</p>
          </div>
  
          {/* Description Section */}
          <div>
            <h3 className="font-semibold text-zinc-700 dark:text-white mb-2">Description</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              {event.description || "No description available"}
            </p>
          </div>
  
          {/* Contacts Section */}
          <div>
            <h3 className="font-semibold text-zinc-700 dark:text-white mb-2">Contacts</h3>
            <div className="text-zinc-600 dark:text-zinc-300">
              {event.contacts && event.contacts.length > 0 ? (
                event.contacts.map((contact, index) => (
                  <div key={index} className="mb-2">
                    <p>{contact.firstName} {contact.lastName}</p>
                    <p className="text-sm">{contact.email}</p>
                  </div>
                ))
              ) : (
                <p>No contacts assigned</p>
              )}
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="pt-4 flex justify-end items-center space-x-4">
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 text-white font-bold rounded-md transition-colors ${
                event.status === "Complete"
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-green-500 hover:bg-green-700"
              }`}
            >
              Mark {event.status === "Complete" ? "Incomplete" : "Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

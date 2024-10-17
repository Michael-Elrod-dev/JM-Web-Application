'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/core';
import { events } from '../../data/eventsData';

export default function CalendarPage() {
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div style={{ padding: '2px', overflow: 'hidden' }}>
        <div style={{ fontWeight: 'bold', fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {eventInfo.event.title}
        </div>
        {!eventInfo.event.allDay && (
          <div style={{ fontSize: '0.75em', opacity: 0.7 }}>
            {eventInfo.timeText}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold mb-6 px-6 py-4">Calendar</h1>
      <div style={{ height: 'calc(100vh - 100px)', padding: '16px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventContent={renderEventContent}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          height="100%"
        />
      </div>
    </div>
  );
}
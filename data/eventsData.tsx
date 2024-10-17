// data/eventsData.tsx
import { EventInput } from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color: string;
}

export const events: CalendarEvent[] = [
  { id: '1', title: 'Site Inspection', start: '2024-09-20T10:00:00', end: '2024-09-20T11:30:00', color: '#4285F4' },
  { id: '2', title: 'Client Meeting', start: '2024-09-20T14:00:00', end: '2024-09-20T15:00:00', color: '#0F9D58' },
  { id: '3', title: 'Project Deadline: Kitchen Remodel', start: '2024-09-22', allDay: true, color: '#DB4437' },
  { id: '4', title: 'Home Builders Expo', start: '2024-09-25', end: '2024-09-27', color: '#F4B400' },
  { id: '5', title: 'Safety Training Workshop', start: '2024-09-26', end: '2024-09-28', color: '#4285F4' },
  { id: '6', title: 'Subcontractor Interview', start: '2024-09-21T14:00:00', end: '2024-09-21T15:00:00', color: '#0F9D58' },
  { id: '7', title: 'Bathroom Renovation', start: '2024-09-23T09:00:00', end: '2024-09-23T17:00:00', color: '#F4B400' },
  { id: '8', title: 'Material Delivery', start: '2024-09-24T11:00:00', end: '2024-09-24T12:00:00', color: '#DB4437' },
  { id: '9', title: 'Team Progress Meeting', start: '2024-09-27T13:00:00', end: '2024-09-27T14:30:00', color: '#4285F4' },
  { id: '10', title: 'Roof Inspection', start: '2024-09-28T10:00:00', end: '2024-09-28T12:00:00', color: '#0F9D58' },
  { id: '11', title: 'Electrical System Upgrade', start: '2024-09-29', allDay: true, color: '#F4B400' },
  { id: '12', title: 'Landscaping Project Kickoff', start: '2024-09-30T09:00:00', end: '2024-09-30T10:30:00', color: '#DB4437' },
  { id: '13', title: 'Foundation Pouring', start: '2024-09-02T08:00:00', end: '2024-09-02T16:00:00', color: '#4285F4' },
  { id: '14', title: 'HVAC Installation', start: '2024-09-05', end: '2024-09-07', allDay: true, color: '#0F9D58' },
  { id: '15', title: 'Permit Inspection', start: '2024-09-09T10:00:00', end: '2024-09-09T11:00:00', color: '#DB4437' },
  { id: '16', title: 'Drywall Installation', start: '2024-09-12T09:00:00', end: '2024-09-14T17:00:00', color: '#F4B400' },
  { id: '17', title: 'Paint Selection Meeting', start: '2024-09-16T13:00:00', end: '2024-09-16T14:30:00', color: '#4285F4' },
  { id: '18', title: 'Flooring Delivery', start: '2024-09-18T11:00:00', end: '2024-09-18T12:00:00', color: '#DB4437' },
  { id: '19', title: 'Plumbing Fixtures Installation', start: '2024-09-19', allDay: true, color: '#0F9D58' },
  { id: '20', title: 'Final Walkthrough', start: '2024-09-30T15:00:00', end: '2024-09-30T17:00:00', color: '#4285F4' },
];
// data/contactsData.tsx

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export const contacts: Contact[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '(123) 456-7890' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '(234) 567-8901' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '(345) 678-9012' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', phone: '(456) 789-0123' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '(567) 890-1234' },
    { id: '6', name: 'Diana Miller', email: 'diana@example.com', phone: '(678) 901-2345' },
    { id: '7', name: 'Ethan Davis', email: 'ethan@example.com', phone: '(789) 012-3456' },
    { id: '8', name: 'Fiona Wilson', email: 'fiona@example.com', phone: '(890) 123-4567' },
    { id: '9', name: 'George Taylor', email: 'george@example.com', phone: '(901) 234-5678' },
    { id: '10', name: 'Hannah Moore', email: 'hannah@example.com', phone: '(012) 345-6789' },
  ];
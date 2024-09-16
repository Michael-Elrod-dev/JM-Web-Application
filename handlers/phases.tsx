// handlers/phases.tsx

export const calculateEndDate = (start: string, durationDays: number): string => {
    const date = new Date(start);
    date.setDate(date.getDate() + durationDays);
    return date.toISOString().split('T')[0];
  };
  
  export const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  export const handleStartDateChange = (
    newStartDate: string,
    jobStartDate: string,
    duration: string,
    setStartDate: React.Dispatch<React.SetStateAction<string>>,
    setEndDate: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (newStartDate >= jobStartDate) {
      setStartDate(newStartDate);
      if (duration) {
        const end = calculateEndDate(newStartDate, parseInt(duration));
        setEndDate(end);
      }
    }
  };
  
  export const handleDurationChange = (
    newDuration: string,
    startDate: string,
    setDuration: React.Dispatch<React.SetStateAction<string>>,
    setEndDate: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setDuration(newDuration);
    if (startDate) {
      const end = calculateEndDate(startDate, parseInt(newDuration));
      setEndDate(end);
    }
  };
  
  export const handleEndDateChange = (
    newEndDate: string,
    startDate: string,
    setEndDate: React.Dispatch<React.SetStateAction<string>>,
    setDuration: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setEndDate(newEndDate);
    if (startDate) {
      const duration = calculateDuration(startDate, newEndDate);
      setDuration(duration.toString());
    }
  };
  
  export const toggleExpansion = <T extends { id: string; isExpanded: boolean }>(
    items: T[],
    itemId: string,
    setItems: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isExpanded: !item.isExpanded } : item
    ));
  };
  
  export const deleteItem = <T extends { id: string }>(
    items: T[],
    itemId: string,
    setItems: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  
  export const addItem = <T,>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    newItem: T
  ) => {
    setItems([...items, newItem]);
  };
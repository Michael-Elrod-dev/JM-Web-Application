export const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00Z");
    return new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    ).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

export const calculateEndDate = (start: string, durationDays: number): string => {
    const date = new Date(start);
    date.setDate(date.getDate() + durationDays);
    return date.toISOString().split('T')[0];
  };
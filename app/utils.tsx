export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return "";

  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  switch (cleaned.length) {
    case 7: // Local number: 555-0402
      return cleaned.replace(/(\d{3})(\d{4})/, "$1-$2");

    case 10: // National number: (501) 555-0402
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    case 11: // International number with 1: +1 (501) 555-0402
      return cleaned.replace(/1(\d{3})(\d{3})(\d{4})/, "+1 ($1) $2-$3");

    default: // Return original if format unknown
      return phone;
  }
};

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

export const formatCardDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const calculateEndDate = (
  start: string,
  durationDays: number
): string => {
  const date = new Date(start);
  date.setDate(date.getDate() + durationDays);
  return date.toISOString().split("T")[0];
};

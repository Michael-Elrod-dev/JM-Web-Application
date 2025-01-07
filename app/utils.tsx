export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  switch (cleaned.length) {
    case 7:
      return cleaned.replace(/(\d{3})(\d{4})/, "$1-$2");

    case 10:
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    case 11:
      return cleaned.replace(/1(\d{3})(\d{3})(\d{4})/, "+1 ($1) $2-$3");

    default:
      return phone;
  }
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

export function formatDate(dateString: string): string {
  if (!dateString || typeof dateString !== "string") {
    throw new Error("Invalid date string");
  }

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ? `${dateString}T00:00:00`
      : dateString
  );

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);

  return `${month}/${day}/${year}`;
}

export const createLocalDate = (dateString: string): Date => {
  return new Date(`${dateString}T00:00:00`);
}

export const formatToDateString = (date: Date): string => {
  return date.toLocaleDateString('en-CA');
}

export const getCurrentBusinessDate = (currentDate: Date): Date => {
  const localDate = createLocalDate(formatToDateString(currentDate));
  const day = localDate.getDay();

  if (day === 0) {
    localDate.setDate(localDate.getDate() + 1);
  } else if (day === 6) {
    localDate.setDate(localDate.getDate() + 2);
  }

  return localDate;
};

export const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  const day = result.getDay();

  if (day === 0) {
    result.setDate(result.getDate() + 1);
  } else if (day === 6) {
    result.setDate(result.getDate() + 2);
  }
  if (days === 0) {
    return result;
  }

  let remaining = Math.abs(days);
  const direction = days < 0 ? -1 : 1;

  while (remaining > 0) {
    result.setDate(result.getDate() + direction);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      remaining--;
    }
  }
  return result;
};

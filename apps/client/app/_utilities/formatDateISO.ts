export const formatDateISO = (date: Date) => {
  return new Date(date).toISOString().split('T')[0];
};

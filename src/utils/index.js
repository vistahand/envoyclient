export const getFormattedStatus = (status) => {
  if (!status) return "Unknown";

  // Convert snake_case to Title Case
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

import { clsx } from "clsx";
import { parseISO, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function formatDate(dateString) {
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy");
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

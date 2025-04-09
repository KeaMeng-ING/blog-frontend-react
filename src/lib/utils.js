import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  // Remove ' - ' and convert to valid ISO format
  const cleaned = date.replace(" - ", "T");
  const d = new Date(cleaned);

  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();

  return `${day} ${month}, ${year}`;
}

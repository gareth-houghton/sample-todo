import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/****
 * Combines and merges CSS class names, resolving Tailwind CSS class conflicts.
 *
 * Accepts any number of class values, conditionally joins them into a single string, and merges Tailwind CSS classes to ensure correct styling.
 *
 * @param inputs - Class values to combine and merge.
 * @returns A merged string of class names with Tailwind CSS conflicts resolved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

"use client";

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive" | "off";
}

/**
 * Accessible live region for screen reader announcements (WCAG 2.2 AAA).
 * Use "polite" for non-urgent updates, "assertive" for critical alerts.
 */
export function LiveRegion({ message, politeness = "polite" }: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      aria-relevant="additions text"
      className="sr-only"
      role={politeness === "assertive" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}

export const en = {
  appName: "HealthTech CDHR1",
  tagline: "Personalized health insights, built with care.",
  nav: {
    dashboard: "Dashboard",
    simulator: "Vision Simulator",
    export: "Export (FHIR)",
    admin: "Admin",
  },
  disclaimer: {
    title: "Medical Disclaimer",
    body: "This platform provides informational health insights and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.",
    accept: "I understand — this is not medical advice",
    required: "You must accept to continue.",
  },
  a11y: {
    skipToMain: "Skip to main content",
    highContrastOn: "High Contrast: ON",
    highContrastOff: "High Contrast: OFF",
    loading: "Loading…",
  },
  dashboard: {
    title: "Clinical Dashboard",
    subtitle: "Your health data, analysed with care and respect.",
    sync: "Sync",
    syncing: "Syncing health data…",
    synced: "Sync completed successfully.",
  },
} as const;

export type I18nKeys = typeof en;

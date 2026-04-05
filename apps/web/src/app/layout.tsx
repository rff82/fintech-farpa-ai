import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Farpa AI",
  description: "HealthTech platform for personalized health insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/Layout"; 

export const metadata: Metadata = {
  title: "My App",
  description: "Migrated from Pages Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

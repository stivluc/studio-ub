import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased grain-texture">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

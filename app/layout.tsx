import CustomCursor from "@/components/CustomCursor";
import RetroSoundManager from "@/components/RetroSoundManager";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="antialiased grain-texture">
        <CustomCursor />
        <RetroSoundManager />
        {children}
      </body>
    </html>
  );
}

import CustomCursor from "@/components/CustomCursor";
import "./globals.css";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <CustomCursor />
      {children}
    </React.Fragment>
  );
}

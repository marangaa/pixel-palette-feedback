import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { NavigationDock } from "@/components/NavigationDock";
import React from "react";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "AI Product Management Suite",
    description: "Transform customer feedback into strategic roadmaps with AI",
};

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            {children}
            <NavigationDock /> {/* NavigationDock will handle its own path logic */}
        </div>
    );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <MainLayout>{children}</MainLayout>
        </body>
        </html>
    );
}

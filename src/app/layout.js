import React from "react";
import { Roboto } from "next/font/google";
import "./globals.css";

const font = Roboto ({
  variable: "--font",
  subsets: ["latin"],
});

export const metadata = {
    title: "Atividade Avaliativa de Front-End",
    icons: {
    icon: "/icons/favicon.ico",
  },
    description: "Projeto de Front-End para avaliação",

};

export default function RootLayout({ children }) {
    return (
        <html>
            <body className={font.variable}>{children}</body>
        </html>
    );
}

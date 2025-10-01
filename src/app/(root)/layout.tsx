import type { Metadata } from "next";

import "../globals.css";
import Header from "@/components/header/Header";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/common/ErrorFallback';





export const metadata: Metadata = {
  title: "Create Next App",
  description: "website give informations about phones their specificaitons and comparison",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
        <div>
          <Header />
          
          
            {children}
          
          
        </div>
          
       
     
  );
}

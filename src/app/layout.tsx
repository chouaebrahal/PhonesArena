import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import SessionProvider from "@/context/SessionProvider";
import { ModalProvider } from "@/context/ModalProvider";




const outfit = Outfit({
  variable: "--outfit",
  subsets: ["latin",],

});



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
    <html lang="en">
      <body
        className={`${outfit.variable}  antialiased`}
      >
        <SessionProvider>
          <ModalProvider>  
            
            
              {children}
           
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

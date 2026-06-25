import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

export const metadata = {
  title: "The Vine Luxuries | Premium Front Desk Concierge Services",
  description: "White-glove residential front desk concierge services for luxury apartments, high-rise condos, and gated communities. Elevating every entry.",
  keywords: ["luxury concierge", "front desk services", "high-rise concierge", "residential concierge", "luxury apartment services", "gated community front desk", "The Vine Luxuries"],
  openGraph: {
    title: "The Vine Luxuries | Premium Front Desk Concierge Services",
    description: "White-glove residential front desk concierge services for luxury apartments, high-rise condos, and gated communities.",
    url: "https://thevineluxuries.com",
    siteName: "The Vine Luxuries",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vine Luxuries | Premium Front Desk",
    description: "White-glove residential front desk concierge services for luxury apartments, high-rise condos, and gated communities.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppToaster } from "@/components/AppToaster";
import { AppAuthProvider } from "@/components/providers/AppAuthProvider";

const graphik = localFont({
  src: [
    {
      path: "../../public/fonts/Graphik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Graphik-Regular.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Graphik-Regular.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Graphik-Regular.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-graphik",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orbis.space"),
  title: {
    default: "Orbis | Create Your Space. Find Your Orbit.",
    template: "%s | Orbis",
  },
  description:
    "Orbis is a 2D metaverse for communities, collaboration, and personal identity. Create your space, find your orbit, and build meaningful digital experiences together.",
  applicationName: "Orbis",
  keywords: [
    "Orbis",
    "2D metaverse",
    "digital community",
    "social space",
    "online collaboration",
    "virtual world",
    "creator community",
  ],
  authors: [{ name: "Orbis" }],
  openGraph: {
    title: "Orbis | Create Your Space. Find Your Orbit.",
    description:
      "A warm, social 2D metaverse where communities gather, create, and connect in their own orbit.",
    url: "https://orbis.space",
    siteName: "Orbis",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Orbis logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbis | Create Your Space. Find Your Orbit.",
    description:
      "Create your space, find your orbit, and build human-centered digital communities in Orbis.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${graphik.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f7f7f4] text-[#0d172a]">
        <AppAuthProvider>
          <AppToaster />
          {children}
        </AppAuthProvider>
      </body>
    </html>
  );
}

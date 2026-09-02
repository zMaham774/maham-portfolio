import type { Metadata } from "next";
import { OpeningScene } from "@/components/opening/OpeningScene";

export const metadata: Metadata = {
  title: "Maham Zafar — Opening Sequence",
  description:
    "A cinematic reveal: from a near-black void, a futuristic exhibition gallery of glowing golden apertures opens around you.",
  openGraph: {
    title: "Maham Zafar — Opening Sequence",
    description:
      "A cinematic reveal: from a near-black void, a futuristic exhibition gallery of glowing golden apertures opens around you.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#050505" }}>
      <h1 className="sr-only">
        Maham Zafar — futuristic exhibition gallery opening sequence
      </h1>
      <OpeningScene />
    </main>
  );
}
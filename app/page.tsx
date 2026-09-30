import type { Metadata } from "next";
import { AudienceEntry } from "@/components/layout/AudienceEntry";

export const metadata: Metadata = {
  title: {
    absolute: "VANE Science | We gave Human Movement a language.",
  },
  description:
    "One Movement Quality Score across seven domains, with dedicated experiences for athletes, coaches and partners.",
  alternates: {
    canonical: "/",
    languages: { "x-default": "/" },
  },
};

export default function HomePage() {
  return <AudienceEntry />;
}

import type { Metadata } from "next";
import FixedPageView from "@/app/_components/FixedPageView";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <FixedPageView slug="about" showContactForm />;
}

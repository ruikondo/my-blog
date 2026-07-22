import type { Metadata } from "next";
import FixedPageView from "@/app/_components/FixedPageView";

export const metadata: Metadata = { title: "Service" };

export default function ServicePage() {
  return <FixedPageView slug="service" />;
}

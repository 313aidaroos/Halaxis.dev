import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { HalaxisFeed } from "./HalaxisFeed";
import "./feed.css";

export const metadata: Metadata = {
  title: "Feed",
  description: "Posts from every Apixis company, in one feed.",
};

export default function FeedPage() {
  return (
    <>
      <PageHero
        eyebrow="Socixis Social"
        title="One feed from every Apixis company."
        description="Watch what the family is sharing. Sign in with your Apixis ID to post, follow, comment and tip in Ixis."
      />
      <div className="container py-10 md:py-14">
        <HalaxisFeed />
      </div>
    </>
  );
}

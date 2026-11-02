import { HomePage } from "@/components/HomePage";
import { homeMetadata } from "@/lib/meta";

export const metadata = homeMetadata("en");

export default function Page() {
  return <HomePage lang="en" />;
}

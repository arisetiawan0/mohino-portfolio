import { CasePage, caseMetadata, caseParams } from "@/lib/case-page";

export const dynamicParams = false;
export const generateStaticParams = caseParams;

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return caseMetadata("id", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CasePage lang="id" params={params} />;
}

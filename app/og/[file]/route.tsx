import { ogByFile, ogFiles } from "@/lib/og";

// Dicetak sekali saat build ke out/og/*.png.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ogFiles().map((file) => ({ file }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const img = await ogByFile(file);
  return img ?? new Response("Not found", { status: 404 });
}

import { redirect } from "next/navigation";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/builder/${id}/personal`);
}

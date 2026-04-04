type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecruiterJobApplicationsPage({
  params,
}: PageProps) {
  const { id } = await params;
  return <p className="text-lg font-medium">Job applications — {id}</p>;
}

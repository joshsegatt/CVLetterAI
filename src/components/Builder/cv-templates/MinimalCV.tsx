export function MinimalCV({ data }: { data: any }) {
  return (
    <div className="font-sans text-gray-900">
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <p className="text-sm text-gray-500">{data.title}</p>
      <div className="mt-4 space-y-2">
        {data.experience?.map((exp: string) => (
          <p key={exp} className="text-sm">{exp}</p>
        ))}
      </div>
    </div>
  );
}

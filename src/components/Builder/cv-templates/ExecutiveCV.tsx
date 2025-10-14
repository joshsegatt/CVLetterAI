export function ExecutiveCV({ data }: { data: any }) {
  return (
    <div className="font-serif text-gray-800">
      <h1 className="text-4xl font-bold tracking-wide">{data.name}</h1>
      <p className="text-lg text-gray-600">{data.title}</p>
      <hr className="my-4 border-gray-400" />
      <h2 className="uppercase text-sm font-semibold text-gray-500">Experience</h2>
      <div className="mt-2 space-y-1">
        {data.experience?.map((exp: string) => (
          <p key={exp} className="text-sm">{exp}</p>
        ))}
      </div>
    </div>
  );
}

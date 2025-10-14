export function ModernCV({ data }: { data: any }) {
  return (
    <div className="font-sans text-gray-900">
      <h1 className="text-3xl font-bold">{data.name}</h1>
      <p className="text-sm text-gray-500">{data.title}</p>
      <hr className="my-4" />
      <h2 className="font-semibold">Experience</h2>
      <ul className="list-disc ml-5">
        {data.experience?.map((exp: string) => <li key={exp}>{exp}</li>)}
      </ul>
    </div>
  );
}

export function ElegantCV({ data }: { data: any }) {
  return (
    <div className="font-serif text-gray-800">
      <h1 className="text-4xl tracking-wide">{data.name}</h1>
      <p className="italic">{data.title}</p>
      <div className="mt-6 space-y-2">
        {data.experience?.map((exp: string) => (
          <p key={exp} className="leading-relaxed">{exp}</p>
        ))}
      </div>
    </div>
  );
}

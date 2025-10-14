export function CreativeCV({ data }: { data: any }) {
  return (
    <div className="font-sans text-gray-900">
      <div className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-4 rounded-t-lg">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p>{data.title}</p>
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-indigo-600">Experience</h2>
        <ul className="list-disc ml-5">
          {data.experience?.map((exp: string) => <li key={exp}>{exp}</li>)}
        </ul>
      </div>
    </div>
  );
}

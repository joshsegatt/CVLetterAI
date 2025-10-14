export function FormalLetter({ data }: { data: any }) {
  return (
    <div className="text-gray-900 leading-relaxed">
      <p>{data.date}</p>
      <p className="mt-4">{data.recipient}</p>
      <p className="mt-4">{data.address}</p>
      <p className="mt-6">Dear {data.recipient},</p>
      <p className="mt-4">{data.body}</p>
      <p className="mt-6">Sincerely,</p>
      <p>{data.sender}</p>
    </div>
  );
}

export function PoliteLetter({ data }: { data: any }) {
  return (
    <div className="text-gray-800 leading-relaxed">
      <p className="italic">Date: {data.date}</p>
      <p className="mt-4">To: {data.recipient}</p>
      <p className="mt-6">Hello {data.recipient},</p>
      <p className="mt-4">{data.body}</p>
      <p className="mt-6">Kind regards,</p>
      <p>{data.sender}</p>
    </div>
  );
}

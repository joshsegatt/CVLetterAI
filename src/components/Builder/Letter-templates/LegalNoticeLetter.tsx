export function LegalNoticeLetter({ data }: { data: any }) {
  return (
    <div className="text-gray-900 leading-relaxed">
      <p className="text-sm text-gray-500">{data.date}</p>
      <p className="mt-4 font-semibold">{data.recipient}</p>
      <p className="text-sm">{data.address}</p>
      <p className="mt-6">Subject: Legal Notice</p>
      <p className="mt-4">{data.body}</p>
      <p className="mt-6 font-semibold">Regards,</p>
      <p>{data.sender}</p>
      <p className="mt-2 text-xs text-gray-500">
        This letter references applicable tenancy legislation and serves as a formal notice.
      </p>
    </div>
  );
}

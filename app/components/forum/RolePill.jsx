// Small tag showing a user's role (e.g. "Business Broker") next to their name.
export default function RolePill({ role }) {
  if (!role) return null;
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide text-[#0A3161] bg-[#0A3161]/8 px-2 py-0.5 rounded-full whitespace-nowrap">
      {role}
    </span>
  );
}

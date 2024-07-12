import InformationalTooltip from "@/app/components/InformationalTooltip";

export default function Claimed() {
  return (
    <span className="secondary">
      (claimed)
      <InformationalTooltip>
        This donation has been reported in the news, but has not yet appeared in
        election data.
      </InformationalTooltip>
    </span>
  );
}

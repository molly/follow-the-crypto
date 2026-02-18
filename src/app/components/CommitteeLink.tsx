import Link from "next/link";

export function CommitteeLink({
  committeeId,
  committeeName,
}: {
  committeeId: string;
  committeeName: string;
}) {
  return <Link href={`/2026/committees/${committeeId}`}>{committeeName}</Link>;
}

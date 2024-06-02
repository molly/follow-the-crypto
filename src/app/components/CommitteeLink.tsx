import Link from "next/link";

export function CommitteeLink({
  committeeId,
  committeeName,
}: {
  committeeId: string;
  committeeName: string;
}) {
  return <Link href={`/committees/${committeeId}`}>{committeeName}</Link>;
}

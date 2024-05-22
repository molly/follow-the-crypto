import sharedStyles from "@/app/shared.module.css";

export default async function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  return (
    <>
      <h1 className={sharedStyles.titleH2}>{params.company}</h1>
    </>
  );
}

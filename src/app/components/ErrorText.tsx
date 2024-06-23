export default function ErrorText({ subject }: { subject: string }) {
  return (
    <span className="secondary">
      Something went wrong when loading {subject}.
    </span>
  );
}

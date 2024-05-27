import styles from "./skeleton.module.css";

export default function Skeleton({
  onCard = false,
  height,
  width,
  ...rest
}: {
  onCard?: boolean;
  height?: string;
  width?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  let className = onCard ? styles.skeletonCard : styles.skeleton;
  if (rest.className) {
    className += ` ${rest.className}`;
  }
  const style = {
    ...(rest.style || {}),
    ...(height && { height }),
    ...(width && { width }),
  };
  return <div {...rest} className={className} style={style} />;
}

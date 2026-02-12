import { Metadata } from "next";

export const BASE_METADATA: Metadata = {
  title: "Follow the Crypto",
  description:
    "Follow the cryptocurrency industry’s influence on 2026 elections in the United States.",
  authors: [{ name: "Molly White", url: "https://www.mollywhite.net" }],
  creator: "Molly White",
  metadataBase: new URL("https://www.followthecrypto.org"),
  openGraph: {
    title: "Follow the Crypto",
    siteName: "Follow the Crypto",
    description:
      "Follow the cryptocurrency industry’s influence on 2026 elections in the United States.",
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Follow the Crypto",
    description:
      "Follow the cryptocurrency industry’s influence on 2026 elections in the United States.",
    site: "@follow__crypto",
    siteId: "1804912038184939520",
    creator: "@molly0xfff",
    creatorId: "545445165",
    images: {
      url: "https://www.followthecrypto.org/twitter-image.png",
      alt: "Follow the Crypto logo",
    },
  },
};

export const customMetadata = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const fullTitle = `${title} | Follow the Crypto`;
  return {
    ...BASE_METADATA,
    twitter: {
      ...BASE_METADATA.twitter,
      title: fullTitle,
      description,
    },
    openGraph: {
      ...BASE_METADATA.openGraph,
      title: fullTitle,
      description,
    },
    title: fullTitle,
    description,
  };
};

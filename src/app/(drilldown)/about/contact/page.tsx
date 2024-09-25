import { customMetadata } from "@/app/utils/metadata";
import { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Contact",
  description: "Frequently asked questions about Follow the Crypto.",
});

export default function FAQPage() {
  return (
    <div className="single-column-page">
      <h2 className={styles.title}>Contact</h2>
      <div className={styles.mainText}>
        <p>
          Spot an error? Found an advertisement by a cryptocurrency-focused PAC
          that isn&rsquo;t on the site yet? Spotted a PAC that appears to be
          crypto-affiliated? Have a question I haven&rsquo;t answered in the{" "}
          <a href="/about/faq">FAQ</a>? Have a suggestion? Just want to say hi?
        </p>
        <p>
          Missing data, errors, or feature suggestions are best submitted{" "}
          <a href="https://github.com/molly/follow-the-crypto/pulls">
            via Github
          </a>{" "}
          if you&rsquo;re able.
        </p>
        <p>
          If you&rsquo;re not, or for anything else, feel free to reach out via
          email to <a href="mailto:ftc@mollywhite.net">ftc@mollywhite.net</a>.
          I&rsquo;m also on the usual social media platforms (
          <a href="https://twitter.com/molly0xFFF">Twitter</a>,{" "}
          <a href="https://hachyderm.io/@molly0xfff">Mastodon</a>, and{" "}
          <a href="https://bsky.app/profile/molly.wiki">Bluesky</a>), and can be
          contacted in a{" "}
          <a href="https://www.mollywhite.net/verify/">
            multitude of other ways
          </a>
          .
        </p>
      </div>
    </div>
  );
}

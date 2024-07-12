import { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "FAQ | Follow the Crypto",
  description: "Frequently asked questions about Follow the Crypto.",
};

export default function FAQPage() {
  return (
    <div className="single-column-page">
      <h2 className={styles.title}>FAQ</h2>
      <div className={styles.mainText}>
        <h3>Why are some contributions attributed only to “Individual”?</h3>
        <p>
          Although the FEC publishes detailed information about anyone who
          contributes to political candidates or campaigns, the goal of this
          project is not to draw attention to the many everyday people who
          choose to make small contributions to support their favored causes or
          candidates. For those who don&rsquo;t appear to be executives or
          senior-level employees at these companies, I have redacted identifying
          information.
        </p>
        <h3>Why are some political advertisements missing?</h3>
        <p>
          Although the FEC tracks ad spending, they do not maintain a database
          of the advertisements themselves. I am doing my best to gather this
          information as I am able, but databases with this information are
          either limited or prohibitively expensive. If you&rsquo;re aware of an
          advertisement that&rsquo;s missing, please{" "}
          <Link href="/about/contact">send it in</Link> so I can add it!
        </p>
        <h3>
          Why does it look like there hasn&rsquo;t been much recent spending
          activity?
        </h3>
        <p>
          There are delays between when expenditures are made and when they are
          filed with the FEC. This project attempts to pull as much as possible
          from{" "}
          <a href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/2024-reporting-dates/24-and-48-hour-reports-independent-expenditures-periods-main-page-2024">
            24- and 48-hour reports
          </a>
          , but some data{" "}
          <a href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/">
            just isn&rsquo;t filed that frequently
          </a>
          .
        </p>
        <h3>
          Are these people and companies donating cryptocurrency or regular
          dollars?
        </h3>
        <p>
          It&rsquo;s a mix, but anecdotally it appears to be mostly dollars.
        </p>
        <h3>
          Who cares what the cryptocurrency industry is doing when
          [oil|pharma|banking|some other industry] also spends millions on
          lobbying and politics?
        </h3>
        <p>
          I do! As a crypto industry researcher, this is something I pay a lot
          of attention to. However, I also think the magnitude of spending
          warrants scrutiny from a much broader audience.
        </p>
        <p>
          I agree that corporate influence on politics is a much broader issue
          than just in the cryptocurrency industry. If you would like to see a
          project like this to track spending from another industry, please make
          it happen! As always, my{" "}
          <a href="https://github.com/molly/follow-the-crypto">
            code is all open source
          </a>
          .
        </p>
      </div>
    </div>
  );
}

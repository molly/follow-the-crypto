/* eslint-disable @next/next/no-img-element */
import { customMetadata } from "@/app/utils/metadata";
import { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "About",
  description: "About Follow the Crypto",
});

export default function AboutPage() {
  return (
    <div className="single-column-page">
      <div>
        <Link href="/about/faq">FAQ</Link> |{" "}
        <Link href="/about/contact">Contact</Link>
      </div>
      <h2 className={styles.title}>About</h2>
      <div className={styles.mainText}>
        <p>
          The cryptocurrency industry has been throwing money into politics
          unlike ever before, and that&rsquo;s even <em>after</em> political
          donations from the industry skyrocketed in the 2022 election cycle.
          Despite the relatively small size of the industry, it has become one
          of the biggest spenders in the upcoming elections in the United
          States.
        </p>
        <p>
          Cryptocurrency companies have raised hundreds of millions of dollars
          to put towards buying crypto-friendly politicians and ousting those
          who have spoken up for stricter regulations to protect consumers in an
          industry that is{" "}
          <a href="https://web3isgoinggreat.com/">
            fraught with hacks, scams, and fraud
          </a>
          . Although parts of the industry have{" "}
          <a href="https://mollywhite.net/micro/entry/202406301401">
            tried to portray this as a grassroots effort
          </a>
          , the reality is that a very small number of crypto companies, and the
          billionaire executives and venture capitalists behind them, are
          spending millions with a singular goal: to obtain favorable crypto
          policy, no matter the cost.
        </p>
        <div className={styles.quoteCard}>
          <img
            src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/brian-armstrong.webp`}
            alt="Brian Armstrong photograph"
            className={styles.quoteCardImage}
          />
          <div>
            <div className={styles.quote}>
              “Money moves the needle. For better or worse, that&rsquo;s how our
              system works.”
            </div>
            <div className={styles.quoteAttribution}>
              &ndash;{" "}
              <Link href="/individuals/brian-armstrong">Brian Armstrong</Link>,{" "}
              <Link href="/companies/coinbase">Coinbase</Link> CEO
            </div>
          </div>
        </div>
        <p>
          This website shines a much-needed spotlight on this spending, without
          the veneer of press releases in which these companies and executives
          still try to claim to be “apolitical” or “non-partisan”.
        </p>
        <p>
          Most of the money in the war chests amassed by cryptocurrency-focused
          PACs has yet to be deployed, and this project will give you a
          real-time<sup>1</sup> view into where it&rsquo;s being spent, by whom,
          and for whom. Join me in <b>following the crypto</b>.
        </p>
        <h3 className={styles.subhead} id="who">
          Who I am
        </h3>
        <p>
          Follow the Crypto is a project by{" "}
          <a href="https://www.mollywhite.net">Molly White</a>, an independent
          technology writer, researcher, and software engineer. She is also the
          force behind{" "}
          <a href="https://www.web3isgoinggreat.com/">
            Web3 is Going Just Great
          </a>
          , where she documents only some of the many disasters in the
          cryptocurrency and web3 industries. She writes about crypto and about
          technology much more broadly in the{" "}
          <i>
            <a href="https://citationneeded.news/">Citation Needed</a>
          </i>{" "}
          newsletter.
        </p>
        <p>
          Consider{" "}
          <a href="https://www.mollywhite.net/support/">supporting her</a> so
          she can continue to do this kind of independent research and writing.
        </p>
        <p>
          She has{" "}
          <a href="https://www.mollywhite.net/crypto-disclosures">
            disclosures
          </a>{" "}
          for her crypto-related work.
        </p>
        <h3 className={styles.subhead} id="data">
          Data
        </h3>
        <p>
          Most of the data shown on this website comes directly from the{" "}
          <a href="https://fec.gov/">Federal Election Commission</a>. Some data
          about political advertisements comes from{" "}
          <a href="https://adstransparency.google.com/">
            Google&rsquo;s Ad Transparency Center
          </a>
          . Some additional information, such as news coverage and some other
          political ads, is gathered manually.
        </p>
        <p>
          Despite the name, none of this data is coming from a blockchain. Most
          election spending by the cryptocurrency industry is in dollars, and
          both crypto- and dollar-denominated election spending are included in
          FEC reporting.
        </p>
        <p>
          Election data is messy, and despite best efforts to clean up the data,
          there <i>may be errors</i>. If you think something&rsquo;s missing or
          erroneous, please <Link href="/about/contact">get in touch</Link>!
        </p>
        <h3 className={styles.subhead} id="code">
          Code
        </h3>
        <p>
          The code for this website is all open source and available on Github:{" "}
          <a href="https://github.com/molly/follow-the-crypto">frontend</a>,{" "}
          <a href="https://github.com/molly/follow-the-crypto-backend">
            backend
          </a>
          .
        </p>
        <h3 className={styles.subhead} id="further-reading">
          Further reading
        </h3>
        <ul>
          <li>
            “
            <a href="https://www.citationneeded.news/2024-cryptocurrency-election-spending/">
              Cryptocurrency companies have raised over $135 million to
              influence US elections this cycle, and they&rsquo;re just getting
              started
            </a>
            ”, Molly White at <i>Citation Needed</i> (May 30, 2024)
          </li>
          <li>
            “
            <a href="https://www.citizen.org/article/cryptobros-united-fairshake-super-pac-2024-elections/">
              Cryptobros United: Crypto Super PACs Amass Over $100 Million for
              2024 Elections
            </a>
            ”, Rick Claypool at <i>Public Citizen</i> (May 6, 2024)
          </li>
          <li>
            “
            <a href="https://www.opensecrets.org/news/issues/crypto">
              Cryptocurrency
            </a>
            ”, <i>OpenSecrets</i> (July 11, 2023)
          </li>
        </ul>
        <div className={styles.footnotes}>
          1. As close to real-time as possible, that is. There are some delays
          between when a contribution is made and when it is reported to the
          FEC.
        </div>
      </div>
    </div>
  );
}

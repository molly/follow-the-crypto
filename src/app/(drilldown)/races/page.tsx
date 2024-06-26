import InfluencedRaces from "@/app/components/InfluencedRaces";
import InfluencedRacesTableContents from "@/app/components/InfluencedRacesTableContents";

export default function RacesList() {
  return (
    <section>
      <h1>Races</h1>
      <p>
        These super PACs and other cryptocurrency-funded groups have already
        spent heavily to influence the outcome of multiple Congressional races.
      </p>
      <InfluencedRaces fullPage={true}>
        <InfluencedRacesTableContents />
      </InfluencedRaces>
    </section>
  );
}

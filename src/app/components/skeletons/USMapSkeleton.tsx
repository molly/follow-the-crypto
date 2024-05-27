import styles from "@/app/components/home/chloroplethMap.module.css";
import * as d3 from "d3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";

export default function USMapSkeleton() {
  const us: Topology<
    Objects<GeoJsonProperties>
  > = require("@/app/data/counties-albers-10m.json");
  const collection: FeatureCollection<Geometry, GeoJsonProperties> =
    topojson.feature(us, us.objects.states) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  const data = collection.features;
  const path = d3.geoPath();

  return (
    <div className={styles.mapWrapper}>
      <svg className={styles.svg} viewBox="0 0 1000 620">
        <g>
          {data.map((d) => {
            return (
              <path
                id={d.id as string}
                key={`state-${d.id}`}
                className={styles.skeletonMap}
                d={path(d) as string}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

import {
  DOMAIN,
  FILL_CLASS_NAMES,
} from "@/app/components/home/chloroplethConstants";
import styles from "@/app/components/home/chloroplethMap.module.css";
import * as d3 from "d3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import Legend from "../home/Legend";

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
      <svg className={styles.svgSkeleton} viewBox="0 0 1000 620">
        <Legend fillClassNames={FILL_CLASS_NAMES} domain={DOMAIN} />
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

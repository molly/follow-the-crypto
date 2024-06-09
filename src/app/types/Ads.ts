export type AdConstant = {
  race: string;
  videoUrl?: string;
};

export type Ad = {
  ad_id: string;
  ad_type: string;
  ad_url: string;
  advertiser_id: string;
  age_targeting: string;
  date_range_end: string;
  date_range_start: string;
  fec_id: string;
  gender_targeting: string;
  geo_targeting_excluded: string | null;
  geo_targeting_included: string | null;
  impressions: string;
  spend_range_max_usd: number;
  spend_range_min_usd: number;
  spend_usd: string | null;
} & AdConstant;

export type AdGroup = {
  GATC_id: string;
  ads: Ad[];
};

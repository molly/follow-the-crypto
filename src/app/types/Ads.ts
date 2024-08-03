export type Source = {
  href: string;
  publisher: string;
};

export type AdConstants = {
  google: Record<string, GoogleAdConstant>;
  images: ImageAd[];
};

export type GoogleAdConstant = {
  race: string;
  videoUrl?: string;
  extraDetails?: React.ReactNode;
  coverage?: Source[];
};

export type GoogleAd = {
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
  type: "google";
} & GoogleAdConstant;

export type ImageAd = {
  alt?: string;
  committee_id: string;
  coverage?: Source[];
  date: string;
  extraDetails?: string;
  humanDate?: string;
  race: string;
  source: string;
  src: string;
  type: "image";
};

export type Ad = GoogleAd | ImageAd;

export type AdGroup = {
  GATC_id: string;
  ads: Ad[];
};

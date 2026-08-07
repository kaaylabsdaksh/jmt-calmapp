// Registry of ESL types — add new types here to extend the system.
export type EslTypeSlug =
  | "blankets"
  | "coverups"
  | "footwear"
  | "gloves"
  | "grounds"
  | "onsite-bucket-trucks"
  | "onsite-coverups"
  | "onsite-grounds"
  | "onsite-hotsticks"
  | "onsite-jumpers"
  | "onsite-line-hoses";

export interface EslTypeConfig {
  slug: EslTypeSlug;
  label: string;
  /** dropdown value used in the legacy form (esl-blankets, esl-gloves, ...) */
  dropdownValue: string;
  route: string;
  description: string;
}

export const ESL_TYPES: EslTypeConfig[] = [
  {
    slug: "blankets",
    label: "ESL - Blankets",
    dropdownValue: "esl-blankets",
    route: "/esl/blankets",
    description: "Fabric inspection & defect workflow",
  },
  {
    slug: "coverups",
    label: "ESL - CoverUps",
    dropdownValue: "esl-coverups",
    route: "/esl/coverups",
    description: "CoverUp inspection workflow",
  },
  {
    slug: "footwear",
    label: "ESL - Footwear",
    dropdownValue: "esl-footwear",
    route: "/esl/footwear",
    description: "Footwear measurements & imagery",
  },
  {
    slug: "gloves",
    label: "ESL - Gloves",
    dropdownValue: "esl-gloves",
    route: "/esl/gloves",
    description: "Glove inspection workflow",
  },
  {
    slug: "grounds",
    label: "ESL - Grounds",
    dropdownValue: "esl-grounds",
    route: "/esl/grounds",
    description: "Grounds resistance testing workflow",
  },
  {
    slug: "onsite-bucket-trucks",
    label: "ESL OnSite - Bucket Trucks",
    dropdownValue: "esl-onsite-bucket-trucks",
    route: "/esl/onsite/bucket-trucks",
    description: "Onsite bucket truck testing workflow",
  },
  {
    slug: "onsite-coverups",
    label: "ESL OnSite - CoverUps",
    dropdownValue: "esl-onsite-coverups",
    route: "/esl/onsite/coverups",
    description: "Onsite CoverUp inspection workflow",
  },
  {
    slug: "onsite-grounds",
    label: "ESL OnSite - Grounds",
    dropdownValue: "esl-onsite-grounds",
    route: "/esl/onsite/grounds",
    description: "Onsite grounds resistance testing workflow",
  },
  {
    slug: "onsite-hotsticks",
    label: "ESL OnSite - Hotsticks",
    dropdownValue: "esl-onsite-hotsticks",
    route: "/esl/onsite/hotsticks",
    description: "Onsite hotstick testing workflow",
  },
  {
    slug: "onsite-jumpers",
    label: "ESL OnSite - Jumpers",
    dropdownValue: "esl-onsite-jumpers",
    route: "/esl/onsite/jumpers",
    description: "Onsite jumper testing workflow",
  },
  {
    slug: "onsite-line-hoses",
    label: "ESL OnSite - Line Hoses",
    dropdownValue: "esl-onsite-line-hoses",
    route: "/esl/onsite/line-hoses",
    description: "Onsite line hose inspection workflow",
  },
];

export const getEslTypeByDropdownValue = (value: string) =>
  ESL_TYPES.find((t) => t.dropdownValue === value);

export const getEslTypeBySlug = (slug?: string) =>
  ESL_TYPES.find((t) => t.slug === slug);

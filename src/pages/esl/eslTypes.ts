// Registry of ESL types — add new types here to extend the system.
export type EslTypeSlug =
  | "blankets"
  | "coverups"
  | "footwear"
  | "gloves"
  | "grounds";

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
];

export const getEslTypeByDropdownValue = (value: string) =>
  ESL_TYPES.find((t) => t.dropdownValue === value);

export const getEslTypeBySlug = (slug?: string) =>
  ESL_TYPES.find((t) => t.slug === slug);

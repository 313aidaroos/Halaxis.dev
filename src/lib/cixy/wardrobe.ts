/**
 * Cixy wardrobe catalog for the Halaxis customizer.
 *
 * Essentials are included and can be equipped in preview.
 * Paid looks stay unowned and unpriced until Apixis Wallet lists them.
 * Do not invent Ixis amounts here.
 */

export const CIXY_SLOTS = [
  {
    id: "skin",
    label: "Skin",
    blurb: "Included complexions. Skin is not a paid cosmetic.",
  },
  {
    id: "hairStyle",
    label: "Hair style",
    blurb: "Modest, professional styles.",
  },
  {
    id: "hairColor",
    label: "Hair color",
    blurb: "Natural colors for the equipped style.",
  },
  {
    id: "eyes",
    label: "Eyes",
    blurb: "A calm, professional set.",
  },
  {
    id: "outfit",
    label: "Outfit",
    blurb: "Modest work clothes. Nothing revealing.",
  },
  {
    id: "office",
    label: "Office",
    blurb: "Where Cixy sits while she explains Halaxis.",
  },
] as const;

export type CixySlotId = (typeof CIXY_SLOTS)[number]["id"];

export type CixyAccess = "essential" | "paid";

export type CixyOption = {
  id: string;
  slot: CixySlotId;
  label: string;
  detail: string;
  access: CixyAccess;
};

export type CixyEquipped = Record<CixySlotId, string>;

export const CIXY_EQUIPPED_STORAGE_KEY = "halaxis.cixy.equipped";

export const CIXY_OPTIONS: readonly CixyOption[] = [
  {
    id: "olive",
    slot: "skin",
    label: "Warm olive",
    detail: "Default complexion.",
    access: "essential",
  },
  {
    id: "wheat",
    slot: "skin",
    label: "Light wheat",
    detail: "Included.",
    access: "essential",
  },
  {
    id: "sand",
    slot: "skin",
    label: "Medium sand",
    detail: "Included.",
    access: "essential",
  },
  {
    id: "deep",
    slot: "skin",
    label: "Deep brown",
    detail: "Included.",
    access: "essential",
  },
  {
    id: "hijab-soft",
    slot: "hairStyle",
    label: "Soft hijab",
    detail: "Face clear, wrap tucked, work-ready.",
    access: "essential",
  },
  {
    id: "khimar",
    slot: "hairStyle",
    label: "Khimar",
    detail: "Longer wrap. Not priced yet.",
    access: "paid",
  },
  {
    id: "structured-wrap",
    slot: "hairStyle",
    label: "Structured wrap",
    detail: "Tailored fold. Not priced yet.",
    access: "paid",
  },
  {
    id: "side-drape",
    slot: "hairStyle",
    label: "Side drape",
    detail: "Quiet drape over one shoulder. Not priced yet.",
    access: "paid",
  },
  {
    id: "espresso",
    slot: "hairColor",
    label: "Espresso",
    detail: "Default.",
    access: "essential",
  },
  {
    id: "soft-black",
    slot: "hairColor",
    label: "Soft black",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "chestnut",
    slot: "hairColor",
    label: "Chestnut",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "auburn",
    slot: "hairColor",
    label: "Auburn",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "calm-brown",
    slot: "eyes",
    label: "Calm brown",
    detail: "Default.",
    access: "essential",
  },
  {
    id: "warm-hazel",
    slot: "eyes",
    label: "Warm hazel",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "soft-amber",
    slot: "eyes",
    label: "Soft amber",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "charcoal-abaya",
    slot: "outfit",
    label: "Charcoal abaya",
    detail: "Long coat, quiet gold line. Default.",
    access: "essential",
  },
  {
    id: "ivory-set",
    slot: "outfit",
    label: "Ivory modest set",
    detail: "Covered work set. Not priced yet.",
    access: "paid",
  },
  {
    id: "wine-coat",
    slot: "outfit",
    label: "Wine work coat",
    detail: "Full-length coat. Not priced yet.",
    access: "paid",
  },
  {
    id: "navy-tailored",
    slot: "outfit",
    label: "Navy tailored set",
    detail: "Covered tailored set. Not priced yet.",
    access: "paid",
  },
  {
    id: "quiet-study",
    slot: "office",
    label: "Quiet study",
    detail: "Default desk and shelves.",
    access: "essential",
  },
  {
    id: "gold-library",
    slot: "office",
    label: "Gold-line library",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "halaxis-desk",
    slot: "office",
    label: "Halaxis desk",
    detail: "Not priced yet.",
    access: "paid",
  },
  {
    id: "private-majlis",
    slot: "office",
    label: "Private majlis",
    detail: "Not priced yet.",
    access: "paid",
  },
];

const optionsBySlot = new Map<CixySlotId, CixyOption[]>();
for (const option of CIXY_OPTIONS) {
  const list = optionsBySlot.get(option.slot) ?? [];
  list.push(option);
  optionsBySlot.set(option.slot, list);
}

export function optionsForSlot(slot: CixySlotId): readonly CixyOption[] {
  return optionsBySlot.get(slot) ?? [];
}

export function findOption(slot: CixySlotId, id: string): CixyOption | undefined {
  return optionsForSlot(slot).find((option) => option.id === id);
}

export function defaultEquipped(): CixyEquipped {
  const equipped = {} as CixyEquipped;
  for (const slot of CIXY_SLOTS) {
    const essential = optionsForSlot(slot.id).find((option) => option.access === "essential");
    if (!essential) {
      throw new Error(`Cixy slot ${slot.id} is missing an essential option.`);
    }
    equipped[slot.id] = essential.id;
  }
  return equipped;
}

/** Keep only owned essentials. Paid or unknown ids fall back to the default. */
export function sanitizeEquipped(value: unknown): CixyEquipped {
  const defaults = defaultEquipped();
  if (!value || typeof value !== "object") return defaults;
  const record = value as Record<string, unknown>;
  const next: CixyEquipped = { ...defaults };
  for (const slot of CIXY_SLOTS) {
    const id = record[slot.id];
    if (typeof id !== "string") continue;
    const option = findOption(slot.id, id);
    if (option?.access === "essential") next[slot.id] = option.id;
  }
  return next;
}

export function isOwned(option: CixyOption): boolean {
  return option.access === "essential";
}

export function equippedOption(equipped: CixyEquipped, slot: CixySlotId): CixyOption {
  const selected = findOption(slot, equipped[slot]);
  if (selected) return selected;
  const fallback = findOption(slot, defaultEquipped()[slot]);
  if (!fallback) throw new Error(`Cixy slot ${slot} has no option.`);
  return fallback;
}

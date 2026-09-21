/**
 * Combo A wardrobe for the one signature Cixy.
 *
 * The face is fixed. Cosmetics are hair, outfit, and office only.
 * Essentials are owned and can be equipped. Paid looks stay unowned
 * and unpriced until Apixis Wallet lists them. Do not invent Ixis amounts.
 */

export const CIXY_FACE = {
  label: "Signature",
  detail: "Same face everywhere. Skin and eyes are not cosmetics.",
} as const;

export const CIXY_SLOTS = [
  {
    id: "hair",
    label: "Hair",
    blurb: "Modest styles on the signature face.",
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
    id: "hijab-soft",
    slot: "hair",
    label: "Soft hijab",
    detail: "Signature hair. Face clear, wrap tucked, work-ready.",
    access: "essential",
  },
  {
    id: "khimar",
    slot: "hair",
    label: "Khimar",
    detail: "Longer wrap. Not priced yet.",
    access: "paid",
  },
  {
    id: "structured-wrap",
    slot: "hair",
    label: "Structured wrap",
    detail: "Tailored fold. Not priced yet.",
    access: "paid",
  },
  {
    id: "side-drape",
    slot: "hair",
    label: "Side drape",
    detail: "Quiet drape over one shoulder. Not priced yet.",
    access: "paid",
  },
  {
    id: "charcoal-abaya",
    slot: "outfit",
    label: "Charcoal abaya",
    detail: "Signature outfit. Long coat, quiet gold line.",
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
    detail: "Signature office. Desk and shelves.",
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

/**
 * Keep only owned essentials for hair, outfit, and office.
 * Older saves used `hairStyle`. Skin, eyes, and hair color are ignored.
 */
export function sanitizeEquipped(value: unknown): CixyEquipped {
  const defaults = defaultEquipped();
  if (!value || typeof value !== "object") return defaults;
  const record = value as Record<string, unknown>;
  const next: CixyEquipped = { ...defaults };
  const rawHair = record.hair ?? record.hairStyle;
  const raw: Record<CixySlotId, unknown> = {
    hair: rawHair,
    outfit: record.outfit,
    office: record.office,
  };
  for (const slot of CIXY_SLOTS) {
    const id = raw[slot.id];
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

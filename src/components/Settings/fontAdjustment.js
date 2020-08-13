import {FONT_ADJUSTMENT} from ".";

export const MAX_FONT_SIZE_ADJUSTMENT = 4;

export function setFontAdjustment(adjustment, storageOverride = null) {
  const storage = storageOverride || localStorage;
  storage.setItem(FONT_ADJUSTMENT, adjustment);
}

export function getFontAdjustment(storageOverride = null) {
  const storage = storageOverride || localStorage;
  const adjustment = storage.getItem(FONT_ADJUSTMENT) || 0;

  if(adjustment > MAX_FONT_SIZE_ADJUSTMENT || adjustment < 0) {
    return MAX_FONT_SIZE_ADJUSTMENT;
  }

  try {
    const parsed = parseInt(adjustment, 10);
    if (Number.isNaN(parsed)) {
      return MAX_FONT_SIZE_ADJUSTMENT;
    }

    return parsed;
  } catch (error) {
    return MAX_FONT_SIZE_ADJUSTMENT;
  }
}


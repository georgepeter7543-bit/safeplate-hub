import { Restaurant, MenuItem } from "./mockData";

export const USD_TO_TZS_RATE = 2650;

export const PLATFORM_BRANDING = {
  instagramHandle: "Trustcore_web",
  instagramUrl: "https://instagram.com/Trustcore_web",
  whatsappNumber: "+255 717 927 133",
  whatsappClean: "255717927133",
  whatsappUrl: "https://wa.me/255717927133?text=Habari%20SafePlate%20Hub%20Admin%20Support",
};

export interface ParsedMultiQuery {
  raw: string;
  hasBudget: boolean;
  budgetMin?: number;
  budgetMax?: number;
  textRemainder: string;
  textTokens: string[];
  displaySummary: string;
}

export interface MultiCriteriaMatchResult {
  matches: boolean;
  matchReasons: {
    restaurantName: boolean;
    foodName: boolean;
    budget: boolean;
    location: boolean;
  };
  matchingDishesCount: number;
  minPriceTZS: number;
  avgPriceTZS: number;
  displaySummary: string;
}

/**
 * Parses user input into numeric budget constraints (TZS) and residual text keywords.
 * Handles:
 * - Standalone numbers: "5000", "5,000", "5000/=", "5000 TZS", "5k", "10k"
 * - Thresholds: "< 8000", "<= 8000", "under 10k", "chini ya 6000", "up to 5000", "max 15000"
 * - Lower bounds: "> 10000", "above 12000", "zaidi ya 8000", "min 5000"
 * - Ranges: "3000 - 8000", "5000 to 10000", "kati ya 4000 na 8000"
 * - Combined queries: "Chips 4000", "Njiro 5000", "Mama Zawadi 10k", "Nyama Choma under 8000"
 * - Plain text queries: "Mama Zawadi", "Pilau", "Ngarenaro", "Njiro", "Chips Mayai"
 */
export function parseMultiCriteriaQuery(query: string, isEng = true): ParsedMultiQuery {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      raw: "",
      hasBudget: false,
      textRemainder: "",
      textTokens: [],
      displaySummary: "",
    };
  }

  // Pre-normalize: convert "10k" / "5.5k" -> "10000" / "5500", remove commas, strip currency labels
  let normalized = trimmed
    .toLowerCase()
    .replace(/(\d+(?:\.\d+)?)\s*k\b/gi, (_, n) => `${Math.round(parseFloat(n) * 1000)}`)
    .replace(/,/g, "");

  let budgetMin: number | undefined;
  let budgetMax: number | undefined;
  let hasBudget = false;
  let budgetSegment = "";

  // 1. Range: "3000 - 7000", "3000 to 7000", "kati ya 3000 na 7000"
  const rangeMatch = normalized.match(/(\d{3,7})\s*(?:-|to|na)\s*(\d{3,7})/i);
  if (rangeMatch) {
    const v1 = parseInt(rangeMatch[1], 10);
    const v2 = parseInt(rangeMatch[2], 10);
    budgetMin = Math.min(v1, v2);
    budgetMax = Math.max(v1, v2);
    hasBudget = true;
    budgetSegment = rangeMatch[0];
  }

  // 2. Upper threshold: "< 5000", "<= 8000", "under 10000", "chini ya 6000", "up to 5000", "max 12000"
  if (!hasBudget) {
    const underMatch = normalized.match(
      /(?:<|<=|under|chini\s+ya|below|less\s+than|up\s+to|max|budget)\s*[:=]?\s*(\d{3,7})/i
    );
    if (underMatch) {
      budgetMax = parseInt(underMatch[1], 10);
      hasBudget = true;
      budgetSegment = underMatch[0];
    }
  }

  // 3. Lower threshold: "> 10000", ">= 10000", "over 5000", "above 8000", "zaidi ya 7000", "min 10000"
  if (!hasBudget) {
    const overMatch = normalized.match(
      /(?:>|>=|over|above|zaidi\s+ya|more\s+than|min)\s*[:=]?\s*(\d{3,7})/i
    );
    if (overMatch) {
      budgetMin = parseInt(overMatch[1], 10);
      hasBudget = true;
      budgetSegment = overMatch[0];
    }
  }

  // 4. Standalone or mixed number (e.g. "5000", "Chips 4000")
  if (!hasBudget) {
    const numMatch = normalized.match(/\b(\d{3,7})\b/);
    if (numMatch) {
      budgetMax = parseInt(numMatch[1], 10);
      hasBudget = true;
      budgetSegment = numMatch[0];
    }
  }

  // Extract residual text by stripping the budget segment and currency labels
  let textRemainder = normalized;
  if (budgetSegment) {
    textRemainder = textRemainder.replace(budgetSegment, "");
  }

  textRemainder = textRemainder
    .replace(/\b(tzs|tsh|tshs|shs|shilingi|\/=)\b/gi, "")
    .replace(/\b(kati|ya|between)\b/gi, "")
    .trim();

  // Tokenize residual text for multi-keyword matching
  const textTokens = textRemainder
    ? textRemainder.split(/\s+/).filter((t) => t.length > 0)
    : [];

  // Generate display summary
  let displaySummary = "";
  if (hasBudget && textRemainder) {
    const budgetText =
      budgetMin !== undefined && budgetMax !== undefined
        ? `${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()} TZS`
        : budgetMax !== undefined
        ? `Up to ${budgetMax.toLocaleString()} TZS`
        : `Above ${budgetMin?.toLocaleString()} TZS`;
    displaySummary = `"${textRemainder}" • ${budgetText}`;
  } else if (hasBudget) {
    displaySummary =
      budgetMin !== undefined && budgetMax !== undefined
        ? isEng
          ? `Budget: ${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()} TZS`
          : `Bajeti: TZS ${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()}`
        : budgetMax !== undefined
        ? isEng
          ? `Budget: Up to ${budgetMax.toLocaleString()} TZS`
          : `Bajeti: Hadi TZS ${budgetMax.toLocaleString()}`
        : isEng
        ? `Budget: Above ${budgetMin?.toLocaleString()} TZS`
        : `Bajeti: Zaidi ya TZS ${budgetMin?.toLocaleString()}`;
  } else {
    displaySummary = isEng ? `Searching: "${trimmed}"` : `Utafutaji: "${trimmed}"`;
  }

  return {
    raw: trimmed,
    hasBudget,
    budgetMin,
    budgetMax,
    textRemainder,
    textTokens,
    displaySummary,
  };
}

/**
 * Evaluates a restaurant against user input across all 4 criteria simultaneously:
 * 1. Restaurant Name
 * 2. Food / Menu Dish Name & Category
 * 3. Budget (Price in TZS)
 * 4. Location / Neighborhood
 */
export function evaluateRestaurantMultiCriteria(
  restaurant: Restaurant,
  query: string,
  isEng = true
): MultiCriteriaMatchResult {
  const avgPriceTZS = Math.round((restaurant.avgDishPriceUSD || 0) * USD_TO_TZS_RATE);
  const dishPricesTZS = (restaurant.menu || []).map((m) =>
    Math.round(m.price * USD_TO_TZS_RATE)
  );
  const minPriceTZS = dishPricesTZS.length > 0 ? Math.min(...dishPricesTZS) : avgPriceTZS;

  const trimmed = query.trim();
  if (!trimmed) {
    return {
      matches: true,
      matchReasons: {
        restaurantName: false,
        foodName: false,
        budget: false,
        location: false,
      },
      matchingDishesCount: (restaurant.menu || []).length,
      minPriceTZS,
      avgPriceTZS,
      displaySummary: "",
    };
  }

  const parsed = parseMultiCriteriaQuery(trimmed, isEng);

  // Helper to check budget on a single price in TZS
  const priceFitsBudget = (priceTZS: number) => {
    if (parsed.budgetMin !== undefined && priceTZS < parsed.budgetMin) return false;
    if (parsed.budgetMax !== undefined && priceTZS > parsed.budgetMax) return false;
    return true;
  };

  const budgetSatisfiedByDishes = (restaurant.menu || []).some((m) =>
    priceFitsBudget(Math.round(m.price * USD_TO_TZS_RATE))
  );
  const budgetSatisfiedByAvg = priceFitsBudget(avgPriceTZS);
  const budgetSatisfied = parsed.hasBudget && (budgetSatisfiedByDishes || budgetSatisfiedByAvg);

  const textQuery = parsed.textRemainder.toLowerCase();
  const tokens = parsed.textTokens;

  const restNameLower = restaurant.name.toLowerCase();
  const locationLower = `${restaurant.neighborhood} ${restaurant.city || 'Arusha'}`.toLowerCase();

  // 1. Restaurant Name Match
  const matchesRestaurantName = textQuery
    ? restNameLower.includes(textQuery) ||
      (tokens.length > 0 && tokens.every((t) => restNameLower.includes(t)))
    : false;

  // 2. Location / Neighborhood Match
  const matchesLocation = textQuery
    ? locationLower.includes(textQuery) ||
      (tokens.length > 0 && tokens.every((t) => locationLower.includes(t)))
    : false;

  // 3. Food / Menu Dish Match
  const matchingDishes = (restaurant.menu || []).filter((dish) => {
    const dishPriceTZS = Math.round(dish.price * USD_TO_TZS_RATE);
    const dishText = `${dish.name} ${dish.nameSw || ''} ${dish.category || ''} ${dish.description || ''}`.toLowerCase();

    const matchesDishText = textQuery
      ? dishText.includes(textQuery) ||
        (tokens.length > 0 && tokens.every((t) => dishText.includes(t)))
      : true;

    const matchesDishBudget = parsed.hasBudget ? priceFitsBudget(dishPriceTZS) : true;

    return matchesDishText && matchesDishBudget;
  });

  const matchesFoodName = textQuery
    ? matchingDishes.length > 0 ||
      (restaurant.categories || []).some((c) => c.toLowerCase().includes(textQuery)) ||
      (restaurant.categoriesSw || []).some((c) => c.toLowerCase().includes(textQuery))
    : false;

  // 4. Cross-Token Match (e.g. "Choma Njiro" -> "choma" in food, "njiro" in location)
  const matchesCrossTokens =
    tokens.length > 1 &&
    tokens.every((token) => {
      const inRest = restNameLower.includes(token);
      const inLoc = locationLower.includes(token);
      const inDishes = (restaurant.menu || []).some((dish) =>
        `${dish.name} ${dish.nameSw || ''} ${dish.category || ''}`.toLowerCase().includes(token)
      );
      const inCats = (restaurant.categories || []).some((c) => c.toLowerCase().includes(token));
      return inRest || inLoc || inDishes || inCats;
    });

  // Final Composite Match Logic
  let matches = false;

  if (parsed.hasBudget && textQuery) {
    // Both budget and text entered (e.g. "Chips 4000", "Njiro 5000", "Mama Zawadi 10k")
    if (matchingDishes.length > 0) {
      matches = true;
    } else if (
      budgetSatisfied &&
      (matchesRestaurantName || matchesLocation || matchesFoodName || matchesCrossTokens)
    ) {
      matches = true;
    }
  } else if (parsed.hasBudget && !textQuery) {
    // Only budget entered (e.g. "5000", "under 10000", "15k")
    matches = budgetSatisfied;
  } else if (!parsed.hasBudget && textQuery) {
    // Only text entered (e.g. "Mama Zawadi", "Pilau", "Njiro", "Choma Njiro")
    matches =
      matchesRestaurantName ||
      matchesLocation ||
      matchesFoodName ||
      matchesCrossTokens;
  }

  return {
    matches,
    matchReasons: {
      restaurantName: matchesRestaurantName,
      foodName: matchesFoodName || matchingDishes.length > 0,
      budget: budgetSatisfied,
      location: matchesLocation,
    },
    matchingDishesCount:
      matchingDishes.length > 0 ? matchingDishes.length : (restaurant.menu || []).length,
    minPriceTZS,
    avgPriceTZS,
    displaySummary: parsed.displaySummary,
  };
}

/**
 * Backward compatibility alias for existing callers
 */
export const parseBudgetQuery = parseMultiCriteriaQuery;
export const checkRestaurantBudgetMatch = evaluateRestaurantMultiCriteria;

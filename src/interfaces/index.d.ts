export interface IRecipe {
  $id: string;
  id: number;
  title: string;
  rawSubtitles: string;
  modelUsed: string; // Openhermes default
  enSubtitles: string;
  ingredients: string;
  instructions: string;
  sourceUrl: string;
  sourceLanguage: string;
  image: string;
  markdownData: string;
  chefTips: string;
  culture: string;
  totalTimeMinutes: number;
  isSubtitlesProcessed: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;
  isLactoseFree: boolean;
  isVegetarian: boolean;
  isKosher: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
  isDairyFree: boolean;
  isNeedsReview: boolean;
  score: number;
}

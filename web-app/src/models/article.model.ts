export interface ArticleProps {
  id: string;
  name: string;
  priceEurCent: number;
  weightKg: number;
  specialShippingCostEurCent?: number;
  quantity: number;
}

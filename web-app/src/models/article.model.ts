export interface ArticleProps {
  id: string;
  name: string;
  priceEur: number;
  weightKg: number;
  specialShippingCost?: number;
  quantity: number;
}

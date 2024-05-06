export interface ArticleProps {
  id: string;
  name: string;
  priceEurCent: number;
  weightG: number;
  specialShippingCostEurCent?: number;
  quantity: number;
}

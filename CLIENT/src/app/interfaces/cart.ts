export interface CartUpdate {
  cartItems: any[];
  total_payment: any;
  total_quantity: any;
  total_variantColor: any;
  ship_code: any;
}
export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}
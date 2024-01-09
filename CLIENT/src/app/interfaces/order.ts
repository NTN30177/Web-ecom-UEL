// export interface IOrder {
//     _id: string;
//     date: Date;
//     status: string;
//     totalPrice: number;
//     totalProducts: number;
//   }
// export interface IOrder {
//     id: string;
//     // orderItems: OrderItem[];
//     // address: Address;
//     status: string;
//     totalPrice: number;
//     totalQuantity: number;
//     createdAt: Date;
//     // updatedAt: Date;
//     // __v: number;
//   }

export interface IOrders {
  userId: any;
  first_name: string;
  last_name: string;
  _id: string;
  address: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  totalQuantity: number;
}
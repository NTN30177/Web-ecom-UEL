// models.ts

interface IVariantColor {
    size: string;
    quantity: number;
  }
  
  interface IVariant {
    color: string; // Assuming color is a string, modify accordingly
    images: string[];
    variantColor: IVariantColor[];
  }
  
  interface IProduct {
    _id:string
    title: string;
    slug: string;
    price: number;
    sku:string;
    discount: number;
    description: string;
    author: string;
    images: string[];
    variants: IVariant[];
    is_deleted: boolean;
  }
  
  interface ISubType {
    _id: string;
    subTypeName: string;
    slug: string;
    products: string[]; // Assuming product IDs are stored as strings, modify accordingly
  }
  
  interface IType {
    _id: string;
    typeName: string;
    slug: string;
    subtypes: string[]; // Assuming subtype IDs are stored as strings, modify accordingly
  }
  
  interface IOrderItem {
    product: string; // Assuming product ID is stored as a string, modify accordingly
    variants: IVariant[];
  }
  
  interface IOrder {
    orderItems: string[]; // Assuming order item IDs are stored as strings, modify accordingly
    shippingAddress: string;
    ward: string;
    district: string;
    province: string;
    nameCustomer: string;
    phone: string;
    status: string;
    totalPrice: number;
    user: string; // Assuming user ID is stored as a string, modify accordingly
    dateOrdered: Date;
  }
  
  interface ICartItem {
    productItem: {
      productId: string; // Assuming product ID is stored as a string, modify accordingly
      variants: IVariant[];
    }[];
  }
  
  interface IColor {
    _id: string;
    nameColor: string;
    image: string;
  }
  
  export {
    IVariant,
    IVariantColor,
    IProduct,
    ISubType,
    IType,
    IOrderItem,
    IOrder,
    ICartItem,
    IColor,
  };
  
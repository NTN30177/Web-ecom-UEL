// models.ts

interface VariantColor {
    size: string;
    quantity: number;
  }
  
  interface Variant {
    color: string; // Assuming color is a string, modify accordingly
    images: string[];
    variantColor: VariantColor[];
  }
  
  interface Product {
    id:string
    title: string;
    slug: string;
    price: number;
    discount: number;
    description: string;
    author: string;
    images: string[];
    variants: Variant[];
  }
  
  interface Subtype {
    subTypeName: string;
    slug: string;
    products: string[]; // Assuming product IDs are stored as strings, modify accordingly
  }
  
  interface Type {
    typeName: string;
    slug: string;
    subtypes: string[]; // Assuming subtype IDs are stored as strings, modify accordingly
  }
  
  interface OrderItem {
    product: string; // Assuming product ID is stored as a string, modify accordingly
    variants: Variant[];
  }
  
  interface Order {
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
  
  interface CartItem {
    productItem: {
      productId: string; // Assuming product ID is stored as a string, modify accordingly
      variants: Variant[];
    }[];
  }
  
  interface Color {
    nameColor: string;
    image: string;
  }
  
  export {
    Variant,
    VariantColor,
    Product,
    Subtype,
    Type,
    OrderItem,
    Order,
    CartItem,
    Color,
  };
  
export interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    gender: number;
    date_of_birth: Date;
    addressList: string[];
    _id:string
    image: string;
    is_admin: number;
    orderList: string[];
    latestPurchase: Date;
    totalRevenue:number //all totalpay of 1 user
    selectedRole?: string; 
  }

  export interface IUserAddress {
    _id: string;
    is_default: boolean;
    name: string;
    phone: string;
    specific_address: string;
    wardData:string,
  }  
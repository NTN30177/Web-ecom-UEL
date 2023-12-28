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
    // image: string;
    // is_admin: number;
    // is_verified: number;
    // token: string;
    // historySearch?: string[];
    // cart?: string; 

    // orderList?: string[];
  }

  export interface IUserAddress {
    is_default: boolean;
    name: string;
    phone: string;
    specific_address: string;
    wardData:string,
  }  
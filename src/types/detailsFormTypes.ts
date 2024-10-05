export interface DeliveryInfo {
    method: string;
    price: number; 
}
  
export interface FormData {
    email: string;
    subscribe?: boolean;
    country: string;
    firstName: string;
    lastName: string;
    addressFinder?: string;
    company?: string;
    address: string;
    address2?: string;
    city: string;
    state?: string;
    postcode: string;
    tel: string;
    delivery: DeliveryInfo;
    promoCode?: string;
    discountAmount?: number; 
}
  
export interface Country {
    name: string;
    delivery: {
      standard: number;
      express?: number;
    }
    fallback?: boolean;
}
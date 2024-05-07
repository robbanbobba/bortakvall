export interface Product {
  id: number;
  name: string;
  price: number;
  onSale: boolean;
  quantity: number; 
  totalPrice: number;
  images: {
    thumbnail: string;
    large: string;
  };
  description: string;
  stock_quantity: number;
  stock_status: string;
  tag: {};
}


export interface ApiResponse {
  status: string
  data: Product[];
}

export interface orderObject {
    customer_first_name: string;
    customer_last_name: string;
    customer_address: string;
    customer_postcode: string;
    customer_city: string;
    customer_email: string;
    customer_phone: string;
    order_total: number;
    order_items: OrderItem[]
}

export interface OrderItem {
    product_id: number;
    qty: number;
    item_price: number;
    item_total: number;
}

export interface varuOrder {
    order_total: number;
    order_items: OrderItem[]
}

export interface formOrder {
    customer_first_name: string;
    customer_last_name: string;
    customer_address: string;
    customer_postcode: string;
    customer_city: string;
    customer_email: string;
    customer_phone: string;
}
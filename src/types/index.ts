export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейсы данных
export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export type ValidationResult = {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// Типы для API
export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductList {
    total: number;
    items: IProduct[];
}

// Класс ShopAPI
export class ShopAPI {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise<IProduct[]> {
        const response = await this.api.get<IProductList>('/product/');
        return response.items;
    }

    async createOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order/', order);
    }
}
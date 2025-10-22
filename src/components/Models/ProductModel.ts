import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel {
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
    private events: EventEmitter;

    constructor(events: EventEmitter, initialProducts: IProduct[] = []) {
        this.events = events;
        this._items = initialProducts;
    }

    setProducts(products: IProduct[]): void {
        this._items = products;
        this.events.emit('products:changed');
    }

    getProducts(): IProduct[] {
        return this._items;
    }

    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.events.emit('product:selected', { product });
}

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}
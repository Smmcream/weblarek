import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
    private _items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        this._items.push(product);
        this.events.emit('cart:changed'); 
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
        this.events.emit('cart:changed'); 
    }

    clear(): void {
        this._items = [];
        this.events.emit('cart:changed'); 
    }

    getTotal(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}
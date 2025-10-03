import { IProduct } from '../../types';

export class ProductModel {
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(initialProducts: IProduct[] = []) {
        this._items = initialProducts;
    }

    setProducts(products: IProduct[]): void {
        this._items = products;
    }

    getProducts(): IProduct[] {
        return this._items;
    }

    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}
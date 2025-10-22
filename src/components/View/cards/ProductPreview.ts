import { Card } from './Card';
import { IProduct } from '../../../types';
import { cloneTemplate, ensureElement } from '../../../utils/utils';

interface IProductPreviewActions {
    onAdd: (event: MouseEvent) => void;
    onRemove: (event: MouseEvent) => void;
}

export class ProductPreview extends Card<IProduct> {
    protected _description: HTMLElement;
    protected _addButton: HTMLButtonElement;
    protected _removeButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, actions?: IProductPreviewActions) {
        super(cloneTemplate(template));
        
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        // Создаем кнопку удаления
        this._removeButton = this._addButton.cloneNode(true) as HTMLButtonElement;
        this._removeButton.textContent = 'Удалить из корзины';
        this._addButton.after(this._removeButton);

        if (actions?.onAdd) {
            this._addButton.addEventListener('click', actions.onAdd);
        }

        if (actions?.onRemove) {
            this._removeButton.addEventListener('click', actions.onRemove);
        }

        // Изначально скрываем кнопку удаления
        this._removeButton.style.display = 'none';
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set inCart(value: boolean) {
        if (value) {
            this._addButton.style.display = 'none';
            this._removeButton.style.display = 'block';
        } else {
            this._addButton.style.display = 'block';
            this._removeButton.style.display = 'none';
            this._addButton.textContent = 'В корзину';
        }
    }
}
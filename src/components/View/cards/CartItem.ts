import { Card } from './Card';
import { IProduct } from '../../../types';
import { cloneTemplate, ensureElement } from '../../../utils/utils';

interface ICartItemActions {
    onDelete: (event: MouseEvent) => void;
}

export class CartItem extends Card<IProduct> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, actions?: ICartItemActions) {
        super(cloneTemplate(template));
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this._deleteButton.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    set description(value: string) {
        // В корзине описание не отображается
    }

    set category(value: string) {
        // В корзине категория не отображается
    }

    set image(value: string) {
        // В корзине изображение не отображается
    }
}
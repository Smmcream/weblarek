import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface ICartActions {
    onOrder: () => void;
}

export class Cart extends Component<{ items: HTMLElement[], total: number }> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICartActions) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (actions?.onOrder) {
            this._button.addEventListener('click', actions.onOrder);
        }
    }

    set items(value: HTMLElement[]) {
        if (value.length) {
            this._list.replaceChildren(...value);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren();
            this.setText(this._list, 'Корзина пуста');
            this._button.disabled = true;
        }
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}
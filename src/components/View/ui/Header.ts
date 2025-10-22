import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IHeaderActions {
    onBasketClick: (event: MouseEvent) => void;
}

export class Header extends Component<{ counter: number }> {
    protected _basket: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, actions?: IHeaderActions) {
        super(container);

        this._basket = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);

        if (actions?.onBasketClick) {
            this._basket.addEventListener('click', actions.onBasketClick);
        }
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    // Добавляем метод setText
    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}
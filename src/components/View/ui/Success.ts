import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface ISuccessActions {
    onClose: () => void;
}

export class Success extends Component<{ total: number }> {
    protected _total: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        if (actions?.onClose) {
            this._closeButton.addEventListener('click', actions.onClose);
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}
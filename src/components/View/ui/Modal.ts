import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IModalActions {
    onClose: () => void;
}

export class Modal extends Component<{ content: HTMLElement }> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, actions?: IModalActions) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Закрытие по кнопке
        this._closeButton.addEventListener('click', () => {
            actions?.onClose?.();
        });

        // Закрытие по клику вне контента
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                actions?.onClose?.();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}
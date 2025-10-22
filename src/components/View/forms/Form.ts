import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export class Form<T> extends Component<T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}
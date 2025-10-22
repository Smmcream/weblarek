import { Form } from './Form';
import { IBuyer } from '../../../types';
import { ensureElement } from '../../../utils/utils';

interface IContactsFormActions {
    onSubmit: (event: SubmitEvent) => void;
}

export class ContactsForm extends Form<IBuyer> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, actions?: IContactsFormActions) {
        super(container);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        // Обработчик отправки формы
        if (actions?.onSubmit) {
            container.addEventListener('submit', actions.onSubmit);
        }
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    setValid(valid: boolean) {
        this._submit.disabled = !valid;
    }

    get email(): string {
        return this._emailInput.value;
    }

    get phone(): string {
        return this._phoneInput.value;
    }

    getFormData(): Partial<IBuyer> {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }
}
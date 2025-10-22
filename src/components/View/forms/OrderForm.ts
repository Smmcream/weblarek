import { Form } from './Form';
import { IBuyer, TPayment } from '../../../types';
import { ensureElement } from '../../../utils/utils';

interface IOrderFormActions {
    onSubmit: (event: SubmitEvent) => void;
    onPaymentChange: (payment: TPayment) => void;
}

export class OrderForm extends Form<IBuyer> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, actions?: IOrderFormActions) {
        super(container);

        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        // Обработчики для кнопок оплаты
        this._cardButton.addEventListener('click', () => {
            this.setPayment('card');
            actions?.onPaymentChange?.('card');
        });

        this._cashButton.addEventListener('click', () => {
            this.setPayment('cash');
            actions?.onPaymentChange?.('cash');
        });

        // Обработчик отправки формы
        if (actions?.onSubmit) {
            container.addEventListener('submit', actions.onSubmit);
        }
    }

    set payment(value: TPayment) {
        this.setPayment(value);
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    get address(): string {
        return this._addressInput.value;
    }

    // для управления состоянием
    setValid(valid: boolean) {
        this._submit.disabled = !valid;
    }

    setAddressError(message: string) {
        this.setText(this._errors, message);
    }

    private setPayment(method: TPayment) {
        // Снимаем выделение со всех кнопок
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });

        // Выделяем выбранную кнопку
        if (method === 'card') {
            this._cardButton.classList.add('button_alt-active');
        } else if (method === 'cash') {
            this._cashButton.classList.add('button_alt-active');
        }
    }

    getFormData(): Partial<IBuyer> {
        const payment = this._cardButton.classList.contains('button_alt-active') ? 'card' :
                       this._cashButton.classList.contains('button_alt-active') ? 'cash' : undefined;

        return {
            payment,
            address: this._addressInput.value
        };
    }
}
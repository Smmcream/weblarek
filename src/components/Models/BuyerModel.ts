import { IBuyer, ValidationResult } from '../../types';

export class BuyerModel {
    private _data: Partial<IBuyer> = {};

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
    }

    getData(): Partial<IBuyer> {
        return this._data;
    }

    clear(): void {
        this._data = {};
    }

    validate(): ValidationResult {
        const errors: ValidationResult = {};

        if (!this._data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this._data.email || this._data.email.trim() === '') {
            errors.email = 'Укажите email';
        }

        if (!this._data.phone || this._data.phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        }

        if (!this._data.address || this._data.address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }

    validateField(field: keyof IBuyer): string | null {
        const value = this._data[field];

        if (!value || (typeof value === 'string' && value.trim() === '')) {
            switch (field) {
                case 'payment':
                    return 'Не выбран способ оплаты';
                case 'email':
                    return 'Укажите email';
                case 'phone':
                    return 'Укажите телефон';
                case 'address':
                    return 'Укажите адрес доставки';
                default:
                    return 'Поле обязательно для заполнения';
            }
        }

        return null;
    }
}
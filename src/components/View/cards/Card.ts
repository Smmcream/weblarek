import { Component } from '../../base/Component';
import { IProduct } from '../../../types/';
import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        
        // Безопасный поиск опциональных элементов
        this._image = container.querySelector('.card__image') || undefined;
        this._category = container.querySelector('.card__category') || undefined;
        this._button = container.querySelector('.card__button, .basket__item-delete') || undefined;
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Недоступно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this._category.className = 'card__category ' + modifier;
            }
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    // Вспомогательный метод для установки текста
    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}
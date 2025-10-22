import { Component } from '../../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
    protected _list: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._list = container;
    }

    set items(value: HTMLElement[]) {
        this._list.replaceChildren(...value);
    }
}
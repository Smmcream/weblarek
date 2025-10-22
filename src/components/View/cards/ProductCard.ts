import { Card } from './Card';
import { IProduct } from '../../../types';
import { cloneTemplate } from '../../../utils/utils';

interface IProductCardActions {
    onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Card<IProduct> {
    constructor(template: HTMLTemplateElement, actions?: IProductCardActions) {
        super(cloneTemplate(template));
        
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        // Для каталога описание не отображается
    }
}
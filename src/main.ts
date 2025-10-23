import './scss/styles.scss';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopAPI, IOrder, TPayment } from './types';  
import { Api } from './components/base/Api'; 
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';

// Импорты View компонентов
import { ProductCard } from './components/View/cards/ProductCard';
import { ProductPreview } from './components/View/cards/ProductPreview';
import { CartItem } from './components/View/cards/CartItem';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactsForm';
import { Header } from './components/View/ui/Header';
import { Gallery } from './components/View/ui/Gallery';
import { Modal } from './components/View/ui/Modal';
import { Cart } from './components/View/ui/Cart';
import { Success } from './components/View/ui/Success';

import { ensureElement, cloneTemplate } from './utils/utils';

// ========== ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ==========

// Создаем EventEmitter
const events = new EventEmitter();

// Создаем модели с EventEmitter
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Создаем API
const api = new Api(API_URL);
const shopAPI = new ShopAPI(api);

// Находим контейнеры в DOM
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Создаем View компоненты
const header = new Header(ensureElement<HTMLElement>('.header'), {
    onBasketClick: () => {
        events.emit('basket:open');
    }
});

const gallery = new Gallery(galleryContainer);

const modal = new Modal(modalContainer, {
    onClose: () => {
        events.emit('modal:close');
    }
});

// Создаем компоненты из templates
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cartView = new Cart(cloneTemplate(cartTemplate), {
    onOrder: () => {
        events.emit('cart:order');
    }
});

// Функции для валидации форм
function validateOrderForm() {
    const errors = buyerModel.validateOrder();
    const isValid = Object.keys(errors).length === 0;
    
    orderForm.setValid(isValid);
    orderForm.setAddressError(errors.address || '');
}

function validateContactsForm() {
    const errors = buyerModel.validateContacts();
    const isValid = Object.keys(errors).length === 0;
    
    contactsForm.setValid(isValid);
    const errorMessages = Object.values(errors).filter(msg => msg).join(', ');
    contactsForm.errors = errorMessages;
}

// Создаем формы с валидацией
const orderForm = new OrderForm(cloneTemplate(orderTemplate) as HTMLFormElement, {
    onSubmit: (event: SubmitEvent) => {
        event.preventDefault();
        events.emit('order:submit');
    },
    onPaymentChange: (payment) => {
        events.emit('order:payment:change', { payment });
    },
    onAddressChange: (address) => {
        events.emit('order:address:change', { address });
    }
});

const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate) as HTMLFormElement, {
    onSubmit: (event: SubmitEvent) => {
        event.preventDefault();
        events.emit('contacts:submit');
    },
    onEmailChange: (email) => {
        events.emit('contacts:email:change', { email });
    },
    onPhoneChange: (phone) => {
        events.emit('contacts:phone:change', { phone });
    }
});

const successView = new Success(cloneTemplate(successTemplate), {
    onClose: () => {
        events.emit('success:close');
    }
});

// обработчик событий:

// Обработчики для событий форм
events.on('order:payment:change', (event: { payment: TPayment }) => {
    buyerModel.setData({ payment: event.payment });
    validateOrderForm();
});

events.on('order:address:change', (event: { address: string }) => {
    buyerModel.setData({ address: event.address });
    validateOrderForm();
});

events.on('contacts:email:change', (event: { email: string }) => {
    buyerModel.setData({ email: event.email });
    validateContactsForm();
});

events.on('contacts:phone:change', (event: { phone: string }) => {
    buyerModel.setData({ phone: event.phone });
    validateContactsForm();
});

// Обработчик изменения каталога товаров
events.on('products:changed', () => {
    const products = productModel.getProducts();
    const cards = products.map(product => {
        const card = new ProductCard(cardTemplate, {
            onClick: () => {
                events.emit('card:select', { product });
            }
        });
        
        const element = card.render(product);
        card.image = CDN_URL + product.image;
        
        return element;
    });
    
    gallery.render({ items: cards });
});

// Обработчик выбора товара для просмотра
events.on('card:select', (event: { product: any }) => {
    productModel.setSelectedProduct(event.product);
});

// Обрабочтки выбора товара в модели
events.on('product:selected', (event: { product: any }) => {
    const preview = new ProductPreview(previewTemplate, {
        onAdd: () => {
            events.emit('preview:add', { product: event.product });
        },
        onRemove: () => {
            events.emit('preview:remove', { productId: event.product.id });
        }
    });
    
    const element = preview.render(event.product);
    preview.image = CDN_URL + event.product.image;
    preview.description = event.product.description;
    preview.inCart = cartModel.contains(event.product.id);
    
    modal.render({ content: element });
    modal.open();
});

// Обработчики добавления или удаления товаров
events.on('preview:add', (event: { product: any }) => {
    cartModel.addItem(event.product);
    events.emit('modal:close');
});

events.on('preview:remove', (event: { productId: string }) => {
    cartModel.removeItem(event.productId);
    events.emit('modal:close');
});

// Обработчик изменения в корзине
events.on('cart:changed', () => {
    header.render({ counter: cartModel.getCount() });
});

// Обработчик открытия корзины
events.on('basket:open', () => {
    const items = cartModel.getItems().map((item, index) => {
        const cartItem = new CartItem(cartItemTemplate, {
            onDelete: () => {
                events.emit('cart:remove', { productId: item.id });
            }
        });
        
        const element = cartItem.render(item);
        cartItem.index = index + 1;
        
        return element;
    });
    
    cartView.render({
        items,
        total: cartModel.getTotal()
    });
    
    modal.render({ content: cartView.render() });
    modal.open();
});

// Удаляем из корзины
events.on('cart:remove', (event: { productId: string }) => {
    cartModel.removeItem(event.productId);
// исправила - Проверяем, открыта ли корзина и перерисовываем её
    if (modalContainer.classList.contains('modal_active')) {
        events.emit('basket:open');
    }
});

// Обработчик оформления заказа
events.on('cart:order', () => {
    buyerModel.clear();
    modal.render({ content: orderForm.render() });
// исправила: Ошибки берутся из модели
    const errors = buyerModel.validateOrder();
    orderForm.setValid(false);
    orderForm.setAddressError(errors.address || '');
});

// Обработчик отправки 
events.on('order:submit', () => {
    const formData = orderForm.getFormData();
    buyerModel.setData(formData);
    
    const errors = buyerModel.validateOrder();
    
    if (Object.keys(errors).length === 0) {
        modal.render({ content: contactsForm.render() });
        validateContactsForm();
    } else {
        if (errors.address) {
            orderForm.setAddressError(errors.address);
        } else if (errors.payment) {
            orderForm.setAddressError(errors.payment);
        }
    }
});

// Обработчик отправки формы контактов
events.on('contacts:submit', () => {
    const formData = contactsForm.getFormData();
    buyerModel.setData(formData);
    
    const errors = buyerModel.validateContacts();
    
    if (Object.keys(errors).length === 0) {
        const buyerData = buyerModel.getData();
        
        if (buyerData.payment && buyerData.email && buyerData.phone && buyerData.address) {
            const order: IOrder = {
                payment: buyerData.payment,
                email: buyerData.email,
                phone: buyerData.phone,
                address: buyerData.address,
                total: cartModel.getTotal(),
                items: cartModel.getItems().map(item => item.id)
            };
            
            shopAPI.createOrder(order)
                .then((response) => {
                    successView.render({ total: response.total });
                    modal.render({ content: successView.render() });
                    
                    cartModel.clear();
                    buyerModel.clear();
                })
                .catch(error => {
                    contactsForm.errors = 'Ошибка при оформлении заказа';
                });
        }
    } else {
        contactsForm.errors = Object.values(errors).join(', ');
    }
});

// Обработчик закрытия успешного оформления
events.on('success:close', () => {
    modal.close();
});

// Обработчик закрытия модального окна
events.on('modal:close', () => {
    modal.close();
});

// запуск приложения

// Загружаем товары с сервера при запуске
shopAPI.getProductList()
    .then(products => {
        productModel.setProducts(products);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });
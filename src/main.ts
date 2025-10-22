import './scss/styles.scss';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopAPI } from './types';  
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

// Инициализация компонентов:

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

// Создаем вью-компоненты
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
    
    if (errors.address) {
        orderForm.setAddressError(errors.address);
    } else {
        orderForm.setAddressError('');
    }
}

function validateContactsForm() {
    const errors = buyerModel.validateContacts();
    const isValid = Object.keys(errors).length === 0;
    
    contactsForm.setValid(isValid);
    
    // Показываем ошибки если они вдруг есть
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
        buyerModel.setData({ payment });
        validateOrderForm();
    }
});

const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate) as HTMLFormElement, {
    onSubmit: (event: SubmitEvent) => {
        event.preventDefault();
        events.emit('contacts:submit');
    }
});

const successView = new Success(cloneTemplate(successTemplate), {
    onClose: () => {
        events.emit('success:close');
    }
});

// Добавляем обработчики изменения полей
orderForm.container.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.name === 'address') {
        buyerModel.setData({ address: event.target.value });
        validateOrderForm();
    }
});

contactsForm.container.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement) {
        if (event.target.name === 'email') {
            buyerModel.setData({ email: event.target.value });
        } else if (event.target.name === 'phone') {
            buyerModel.setData({ phone: event.target.value });
        }
        validateContactsForm();
    }
});

// Обработчик событий:

// Обработчик изменения каталога товаров
events.on('products:changed', () => {
    const products = productModel.getProducts();
    const cards = products.map(product => {
        const card = new ProductCard(cardTemplate, {
            onClick: () => {
                events.emit('card:select', { product });
            }
        });
        
        // Рендерим карточку с базовыми данными
        const element = card.render(product);
        
        // Устанавливаем изображение отдельно через сеттер
        card.image = CDN_URL + product.image;
        
        return element;
    });
    
    gallery.render({ items: cards });
});

// Обработчик выбора товара для просмотра
events.on('card:select', (event: { product: any }) => {
    productModel.setSelectedProduct(event.product);
});

// Обработчик выбора товара в модели
events.on('product:selected', (event: { product: any }) => {
    const preview = new ProductPreview(previewTemplate, {
        onAdd: () => {
            events.emit('preview:add', { product: event.product });
        },
        onRemove: () => {
            events.emit('preview:remove', { productId: event.product.id });
        }
    });
    
    // Рендерим превью с базовыми данными
    const element = preview.render(event.product);
    
    // Устанавливаем изображение и статус корзины отдельно
    preview.image = CDN_URL + event.product.image;
    preview.description = event.product.description;
    preview.inCart = cartModel.contains(event.product.id);
    
    modal.render({ content: element });
    modal.open();
});

// Обработчики добавления/удаления товаров
events.on('preview:add', (event: { product: any }) => {
    cartModel.addItem(event.product);
    events.emit('modal:close');
});

events.on('preview:remove', (event: { productId: string }) => {
    cartModel.removeItem(event.productId);
    events.emit('modal:close');
});

// Обработчик изменения корзины
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
        
        // Сначала рендерим основные данные продукта
        const element = cartItem.render(item);
        // Затем устанавливаем индекс через сеттер
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
});

// Обрабаотчик оформления заказа
events.on('cart:order', () => {
    // Сбрасываем данные покупателя при начале оформления
    buyerModel.clear();
    modal.render({ content: orderForm.render() });
    
    // Без данных кнопка должна быть неактивной
    orderForm.setValid(false);
    orderForm.setAddressError('Необходимо указать адрес');
});

// Обрабочтик отправки формы заказа
events.on('order:submit', () => {
    const formData = orderForm.getFormData();
    buyerModel.setData(formData);
    
    // Используем валидацию только для заказа
    const errors = buyerModel.validateOrder();
    console.log('Ошибки формы заказа:', errors);
    
    if (Object.keys(errors).length === 0) {
        modal.render({ content: contactsForm.render() });
        
        // Инициализируем валидацию формы контактов
        validateContactsForm();
    } else {
        // Показываем ошибки
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
    
    // Используем валидацию только для контактов
    const errors = buyerModel.validateContacts();
    console.log('Ошибки формы контактов:', errors);
    
    if (Object.keys(errors).length === 0) {
        // Создаем заказ
        const order = {
            ...buyerModel.getData(),
            total: cartModel.getTotal(),
            items: cartModel.getItems().map(item => item.id)
        } as any;
        
        console.log('Отправка заказа:', order);
        
        // Отправляем заказ на сервер
        shopAPI.createOrder(order)
            .then((response) => {
                console.log('Заказ создан:', response);
                successView.render({ total: response.total });
                modal.render({ content: successView.render() });
                
                // Очищаем корзинку и данные юзера
                cartModel.clear();
                buyerModel.clear();
            })
            .catch(error => {
                console.error('Ошибка при создании заказа:', error);
                contactsForm.errors = 'Ошибка при оформлении заказа';
            });
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

// Запуск приложения:

// Загружаем товары с сервера при запуске
shopAPI.getProductList()
    .then(products => {
        console.log('API_URL:', API_URL);
        console.log('CDN_URL:', CDN_URL);
        console.log('Загружено товаров:', products.length);
        if (products.length > 0) {
            console.log('Первый товар:', products[0]);
            console.log('Полный URL изображения:', CDN_URL + products[0]?.image);
        }
        productModel.setProducts(products);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
    });

console.log('Приложение запущено!');


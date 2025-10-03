import './scss/styles.scss';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopAPI } from './types';  
import { Api } from './components/base/Api'; 
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

console.log('=== Тестирование моделей данных ===');

// Создание экземпляров для классов
const productModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Тестируме ProductModel
console.log('--- ProductModel ---');
productModel.setProducts(apiProducts.items);

console.log('Массив товаров из каталога:', productModel.getProducts());
console.log('Количество товаров в каталоге:', productModel.getProducts().length);

const testProductId = '854cef69-976d-4c2a-a18c-2aa45046c390';
const productById = productModel.getProductById(testProductId);
console.log(`Товар по ID "${testProductId}":`, productById);

productModel.setSelectedProduct(apiProducts.items[0]);
console.log('Выбранный товар для просмотра:', productModel.getSelectedProduct());

// Тестируем CartModel
console.log('--- CartModel ---');
console.log('Корзина пуста:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость корзины:', cartModel.getTotal());

// Добавляем товары в корзину
console.log('Добавляем товары в корзину...');
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления:', cartModel.getItems());
console.log('Количество товаров после добавления:', cartModel.getCount());
console.log('Общая стоимость после добавления:', cartModel.getTotal());

// Проверяем наличие товара
console.log(`Товар с ID "${testProductId}" в корзине:`, cartModel.contains(testProductId));

// Удаляем товар
console.log('Удаляем товар из корзины...');
cartModel.removeItem(testProductId);
console.log('Товары в корзине после удаления:', cartModel.getItems());
console.log('Количество товаров после удаления:', cartModel.getCount());

// Чистимкорзину
console.log('Очищаем корзину...');
cartModel.clear();
console.log('Корзина после очистки:', cartModel.getItems());
console.log('Количество товаров после очистки:', cartModel.getCount());

// Тестируем BuyerModel
console.log('--- BuyerModel ---');
console.log('Данные покупателя (изначально пустые):', buyerModel.getData());

// Добавляем данные 1 этап
console.log('Добавляем email...');
buyerModel.setData({ email: 'test@example.com' });
console.log('Данные после добавления email:', buyerModel.getData());

// Добавляем данные 2й этап
console.log('Добавляем телефон и адрес...');
buyerModel.setData({ phone: '+79991234567', address: 'Москва, ул. Примерная, д. 1' });
console.log('Данные после добавления телефона и адреса:', buyerModel.getData());

// Проверяем валидацию 
console.log('Проверяем валидацию (payment не заполнен):', buyerModel.validate());
console.log('Валидация поля payment:', buyerModel.validateField('payment'));
console.log('Валидация поля email:', buyerModel.validateField('email'));

// Заполняем все поля
console.log('Заполняем все поля...');
buyerModel.setData({ payment: 'card' });
console.log('Все данные покупателя:', buyerModel.getData());
console.log('Результат валидации (все поля заполнены):', buyerModel.validate());

// Проверяем валидацию 
console.log('Валидация поля email (после заполнения):', buyerModel.validateField('email'));
console.log('Валидация поля phone (после заполнения):', buyerModel.validateField('phone'));
console.log('Валидация поля address (после заполнения):', buyerModel.validateField('address'));
console.log('Валидация поля payment (после заполнения):', buyerModel.validateField('payment'));

// Чистим данные
console.log('Очищаем данные покупателя...');
buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());
console.log('Результат валидации после очистки:', buyerModel.validate());

console.log('=== Все модели работают корректно! ===');

// Делаем запрос к сверверу за нашими товарами

console.log('=== Запрос к серверу за каталогом товаров ===');

// Создаем Api с использованием константы из constants.ts
console.log('API URL:', API_URL);
const api = new Api(API_URL);
const shopAPI = new ShopAPI(api);

// Запрос к серверу за массивом товаров
shopAPI.getProductList()
    .then(products => {
        console.log('Получены товары с сервера:', products);
        
        // Сохраняем массив 
        productModel.setProducts(products);
        
        // Выводим массаив в консоль
        const savedProducts = productModel.getProducts();
        console.log('Товары в ProductModel после сохранения с сервера:', savedProducts);
        console.log('Количество товаров с сервера:', savedProducts.length);
        
        console.log('=== Запрос к серверу выполнен успешно! ===');
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });
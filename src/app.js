import ProductWidget from './components/product-list/productWidget';

const productWidget = new ProductWidget('.container__table');
productWidget.bindToDOM();
productWidget.renderContent();

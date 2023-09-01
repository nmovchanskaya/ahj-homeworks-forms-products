import Product from './product';

export default class ProductList {
  constructor(products) {
    this.products = [];
    products.forEach((item) => {
      const product = new Product(item.name, item.price, item.id);
      this.products.push(product);
    });
  }

  add(product) {
    this.products.push(product);
  }

  update(productId, productName, productPrice) {
    const product = this.products.find((item) => item.id === productId);
    product.edit(productName, productPrice);
  }

  remove(productId) {
    this.products = this.products.filter((item) => item.id !== productId);
  }
}

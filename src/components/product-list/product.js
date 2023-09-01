export default class Product {
  constructor(name, price, id) {
    if (id) {
      this.id = id;
    } else {
      this.id = Math.floor(performance.now());
    }
    this.name = name;
    this.price = price;
  }

  edit(name, price) {
    this.name = name;
    this.price = price;
  }
}

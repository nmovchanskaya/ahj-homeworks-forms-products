/**
 * @jest-environment jsdom
*/
import ProductWidget from '../components/product-list/productWidget';

test('delete', () => {
  document.body.innerHTML = `
    <div class="container">
        <div class="container__title">
            Products
        </div>
        <div class="container__button_add">
            +
        </div>
        <div class="container__table">
        </div>
    </div>
  `;

  const container = document.querySelector('.container__table');
  const productWidget = new ProductWidget('.container__table');
  productWidget.bindToDOM();
  productWidget.renderContent();

  const delButton = container.querySelector('.delete');
  const productId = delButton.dataset.id;
  delButton.click();

  const idx = productWidget.productList.products.findIndex((item) => item.id === productId);
  expect(idx).toBe(-1);
});

test('add product', () => {
  document.body.innerHTML = `
    <div class="container">
        <div class="container__title">
            Products
        </div>
        <div class="container__button_add">
            +
        </div>
        <div class="container__table">
        </div>
    </div>
  `;

  const container = document.querySelector('.container__table');
  const productWidget = new ProductWidget('.container__table');
  productWidget.bindToDOM();
  productWidget.renderContent();
  const prevQty = productWidget.productList.products.length;
  const submitBtn = container.querySelector('.product__add_submit');

  productWidget.addButton.click();
  productWidget.nameElemAdd.value = 'test';
  productWidget.priceElemAdd.value = 123;
  submitBtn.click();

  const idx = productWidget.productList.products.findIndex(
    (item) => item.name === 'test'
    && Number(item.price) === 123,
  );
  const delta = productWidget.productList.products.length - prevQty;

  // check that we added 1 product with new data
  console.log(productWidget.productList.products[3].name);
  console.log(productWidget.productList.products[3].price);
  expect(idx > -1 && delta === 1).toBe(true);
});

test('edit product', () => {
  document.body.innerHTML = `
      <div class="container">
          <div class="container__title">
              Products
          </div>
          <div class="container__button_add">
              +
          </div>
          <div class="container__table">
          </div>
      </div>
    `;

  const container = document.querySelector('.container__table');
  const productWidget = new ProductWidget('.container__table');
  productWidget.bindToDOM();
  productWidget.renderContent();

  const editButton = container.querySelector('.edit');
  const productId = Number(editButton.dataset.id);
  editButton.click();

  const submitBtn = container.querySelector('.product__edit_submit');
  productWidget.nameElemEdit.value = 'test_edit';
  productWidget.priceElemEdit.value = 1234;
  submitBtn.click();

  const product = productWidget.productList.products.find(
    (item) => item.id === productId,
  );

  // check that we edited 1 product with new data
  expect(product.name === 'test_edit' && Number(product.price) === 1234).toBe(true);
});

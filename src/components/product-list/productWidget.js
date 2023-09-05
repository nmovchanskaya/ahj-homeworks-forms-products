import Product from './product';
import ProductList from './productList';
import data from './products.json';
import TooltipWidget from '../tooltip/tooltipWidget';

export default class ProductWidget {
  constructor(containerName) {
    this.containerElemName = containerName;
    this.productList = new ProductList(data);
    this.onClickProduct = this.onClickProduct.bind(this);
    this.onAddProduct = this.onAddProduct.bind(this);
    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.onAddCancel = this.onAddCancel.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onEditCancel = this.onEditCancel.bind(this);
  }

  addFormMarkup() {
    return `
        <form class="product__add_form">
            <label for="product__add_input_name">Name</label>
            <input type="text" class="product__add_input" name="name" id="product__add_input_name" required>
            <label for="product__add_input_price">Price</label>
            <input type="text" class="product__add_input" name="price" id="product__add_input_price" required>
            <input type="submit" value="Submit" class="product__add_submit">
            <input type="button" value="Cancel" class="product__add_cancel">
        </form>
    `;
  }

  editFormMarkup() {
    return `
        <form class="product__edit_form">
            <label for="product__edit_input_name">Name</label>
            <input type="text" class="product__edit_input" name="name" id="product__edit_input_name" required>
            <label for="product__edit_input_price">Price</label>
            <input type="text" class="product__edit_input" name="price" id="product__edit_input_price" required>
            <input type="text" class="hidden" name="id">
            <input type="submit" value="Submit" class="product__edit_submit">
            <input type="button" value="Cancel" class="product__edit_cancel">
        </form>
    `;
  }

  bindToDOM() {
    this.container = document.querySelector(this.containerElemName);

    this.container.addEventListener('click', this.onClickProduct);
  }

  bindToDOMAdd() {
    this.addForm = document.querySelector('.product__add_form');
    this.addButton = document.querySelector('.container__button_add');
    this.nameElemAdd = this.addForm.querySelector('[name="name"]');
    this.priceElemAdd = this.addForm.querySelector('[name="price"]');
    this.priceElemAdd.setAttribute('pattern', '^\\d+(.\\d+)?$');
    this.cancelButtonAdd = this.addForm.querySelector('.product__add_cancel');

    this.addButton.addEventListener('click', this.onAddProduct);
    this.cancelButtonAdd.addEventListener('click', this.onAddCancel);
    this.addForm.addEventListener('submit', this.onAddSubmit);

    this.tooltipAddWidget = new TooltipWidget('.product__add_form');
  }

  bindToDOMEdit() {
    this.editForm = document.querySelector('.product__edit_form');
    this.nameElemEdit = this.editForm.querySelector('[name="name"]');
    this.priceElemEdit = this.editForm.querySelector('[name="price"]');
    this.priceElemEdit.setAttribute('pattern', '^\\d+(.\\d+)?$');
    this.idElemEdit = this.editForm.querySelector('[name="id"]');
    this.cancelButtonEdit = this.editForm.querySelector('.product__edit_cancel');

    this.editForm.addEventListener('submit', this.onEditSubmit);
    this.cancelButtonEdit.addEventListener('click', this.onEditCancel);

    this.tooltipEditWidget = new TooltipWidget('.product__edit_form');
  }

  renderProduct(product) {
    return `
      <tr>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td class="edit_field">
            <span class="edit" data-id="${product.id}">&#9998;</span>
            <span class="delete" data-id="${product.id}">x</span>
        </td>
      </tr>
    `;
  }

  renderContent() {
    // render add form
    const addForm = document.createElement('form');
    addForm.className = 'product__add_form';
    addForm.noValidate = true;
    addForm.innerHTML = this.addFormMarkup();
    this.container.insertBefore(addForm, null);

    // add listeners
    this.bindToDOMAdd();

    // render edit form
    const editForm = document.createElement('form');
    editForm.className = 'product__edit_form';
    editForm.noValidate = true;
    editForm.innerHTML = this.editFormMarkup();
    this.container.insertBefore(editForm, null);

    // edit listeners
    this.bindToDOMEdit();

    // render list of products
    this.renderProducts();

    // add tooltip listeners
    this.tooltipAddWidget.bindToDOM();
    this.tooltipEditWidget.bindToDOM();
  }

  renderProducts() {
    const table = document.createElement('table');
    table.className = 'products';
    const ths = '<th>Name</th><th>Price</th><th>Actions</th>';
    table.innerHTML = ths;

    this.container.insertBefore(table, null);
    this.productList.products.forEach((item) => {
      const elemCode = this.renderProduct(item);
      table.insertAdjacentHTML('beforeend', elemCode);
    });
  }

  clearProducts() {
    const table = document.querySelector('table');
    table.remove();
  }

  onClickProduct(e) {
    if (e.target.className === 'delete') {
      this.productList.remove(Number(e.target.dataset.id));
      e.target.closest('tr').remove();
    } else if (e.target.className === 'edit') {
      this.editForm.classList.toggle('product__edit_form_active');
      const product = this.productList.products.find((item) => item.id === Number(e.target.dataset.id));
      this.nameElemEdit.value = product.name;
      this.priceElemEdit.value = product.price;
      this.idElemEdit.value = product.id;
    }
  }

  onAddProduct(e) {
    this.addForm.classList.toggle('product__add_form_active');
  }

  onAddSubmit(e) {
    e.preventDefault();
    const haveError = this.tooltipAddWidget.onSubmit(e);
    if (!haveError) {
      const name = this.nameElemAdd.value;
      const price = this.priceElemAdd.value;
      this.productList.add(new Product(name, price));
      this.nameElemAdd.value = '';
      this.priceElemAdd.value = '';
      this.addForm.classList.toggle('product__add_form_active');

      // refresh table of products
      this.clearProducts();
      this.renderProducts();
    }
  }

  onAddCancel(e) {
    if (e.target.className === 'product__add_cancel') {
      this.tooltipAddWidget.clearTooltips();
      this.nameElemAdd.value = '';
      this.priceElemAdd.value = '';
      this.addForm.classList.toggle('product__add_form_active');
    }
  }

  onEditSubmit(e) {
    e.preventDefault();
    const haveError = this.tooltipEditWidget.onSubmit(e);
    if (!haveError) {
      const name = this.nameElemEdit.value;
      const price = this.priceElemEdit.value;
      const id = Number(this.idElemEdit.value);
      this.productList.update(id, name, price);
      this.nameElemEdit.value = '';
      this.priceElemEdit.value = '';
      this.editForm.classList.toggle('product__edit_form_active');

      // refresh table of products
      this.clearProducts();
      this.renderProducts();
    }
  }

  onEditCancel(e) {
    this.tooltipEditWidget.clearTooltips();
    this.nameElemEdit.value = '';
    this.priceElemEdit.value = '';
    this.editForm.classList.toggle('product__edit_form_active');
  }
}

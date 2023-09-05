import Tooltip from './tooltip';
import { errors } from './errors';

export default class TooltipWidget {
  constructor(formName) {
    this.formName = formName;
    this.tooltipFactory = new Tooltip();
    this.actualTooltips = [];

    this.onSubmit = this.onSubmit.bind(this);
  }

  bindToDOM() {
    this.form = document.querySelector(this.formName);
  }

  showTooltip(message, el) {
    this.actualTooltips.push({
      name: el.name,
      id: this.tooltipFactory.showTooltip(message, el),
    });
  }

  getError(el) {
    const errorKey = Object.keys(ValidityState.prototype).find((key) => {
      if (!el.name) return;
      if (key === 'valid') return;

      return el.validity[key];
    });

    if (!errorKey) return;

    return errors[el.name][errorKey];
  }

  onSubmit(e) {
    this.clearTooltips();

    if (this.form.checkValidity()) {
      console.log('valid');
      this.currentStatus = true;
    } else {
      console.log('invalid');
      this.currentStatus = false;
    }

    if (!this.currentStatus) {
      const { elements } = this.form;

      [...elements].some((elem) => {
        const error = this.getError(elem);

        if (error) {
          this.showTooltip(error, elem);
          return true;
        }
      });
      // if we have errors
      return true;
    }

    console.log('submit');
    return false;
  }

  clearTooltips() {
    this.actualTooltips.forEach((message) => this.tooltipFactory.removeTooltip(message.id));
    this.actualTooltips = [];
  }
}

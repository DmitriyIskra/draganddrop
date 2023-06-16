export default class ControlAddForm {
  constructor(form) {
    this.form = form;
    this.textArea = this.form.querySelector('.add-textarea');
  }

  showForm() {
    this.form.classList.add('active');
  }

  hideForm(e) {
    e.preventDefault(); 

    this.form.classList.remove('active');

    this.textArea.value = '';
  }
}

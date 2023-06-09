import SaveState from './saveState';
import ControlAddForm from './controlAddForm';

export default class controlWidget{
    constructor(widget) {
        this.widget = widget;
        this.controlForm = new ControlAddForm(this.widget.querySelector('.wr-add-form'));
        this.textArea = this.widget.querySelector('.add-textarea');
        this.columns = null;
        this.saveState = new SaveState();
        this.activeColumn = null;

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.saveState.load(this.widget);

        this.saveState.save(this.widget);

        this.widget.addEventListener('click', this.onClick)
    }

    onClick(e) {
        // Открытие формы добавления карточки
        if(e.target.matches('.link-add-card')) {
            e.preventDefault();

            this.activeColumn = e.target.closest('.column');
            
            this.controlForm.showForm();
        }


        // Добавление карточек
        if(e.target.matches('.add__button')) {

            // Получаем введенный текст
            const value = this.textArea.value;

            // получаем ноду куда вставить новую карточку
            const activeCards = this.activeColumn.querySelector('.cards');

            // готовим имя класса
            let title = this.activeColumn.querySelector('.title-column').textContent;
            title = title.toLowerCase();
            const className = title.replace(/\s/, '-');
            
            // добавляем карточку
            this.saveState.addCard(activeCards, value, className);

            // сохраняем
            this.saveState.save(this.widget);
            
            // закрываем форму добавления
            this.controlForm.hideForm(e);
        }

        // Закрытие формы добавления карточки
        if(e.target.matches('.close-form')) {
            this.controlForm.hideForm(e);
        }

        // Удаление карточек
        if(e.target.matches('.delete-card')) {
            const activeCard = e.target.closest('.card');

            // Удаляем карточку
            this.saveState.delete(activeCard);
            // Сохраняем виджет
            this.saveState.save(this.widget);
            
        }
    }
}
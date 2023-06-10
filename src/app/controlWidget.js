export default class controlWidget {
  constructor(widget, saveState, ControlAddForm, cursor) {
    this.widget = widget;
    this.controlForm = ControlAddForm;
    this.saveState = saveState;
    this.cursor = cursor;

    this.textArea = this.widget.querySelector('.add-textarea');
    this.columns = null;
    this.activeColumn = null;
    this.activeCard = null;
    // положение курсора при нажатии относительно верха или стороны карточки
    this.takeIndentX = null;
    this.takeIndentY = null;
    // Подэлемент и прошлый подэлемент
    this.subElement = null;
    this.lastSubElement = null;
    // центр подэлемента над которым нависает перетаскиваемый элемент
    this.subElementCenter = null; 

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this)
  }

  init() {
    this.saveState.load(this.widget);

    this.saveState.save(this.widget);

    this.widget.addEventListener('click', this.onClick);
    this.widget.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onClick(e) {
    // Открытие формы добавления карточки
    if (e.target.matches('.link-add-card')) {
      e.preventDefault();

      this.activeColumn = e.target.closest('.column');

      this.controlForm.showForm();
    }

    // Добавление карточек
    if (e.target.matches('.add__button')) {
      // Получаем введенный текст
      const { value } = this.textArea;

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
    if (e.target.matches('.close-form')) {
      this.controlForm.hideForm(e);
    }

    // Удаление карточек
    if (e.target.matches('.delete-card')) {
      const activeCard = e.target.closest('.card');

      // Удаляем карточку
      this.saveState.delete(activeCard);
      // Сохраняем виджет
      this.saveState.save(this.widget);
    }
  }

  onMouseOver(e) {
    // получаем координаты для позиционирования карточки
    // для того чтобы курсор оставался где схватили
    let x = e.clientX - this.widget.offsetLeft - this.takeIndentX;
    let y = e.clientY - this.widget.offsetTop - this.takeIndentY;
    
    // присвоение координат
    this.activeCard.style.top = `${y}px`;
    this.activeCard.style.left = `${x}px`;

    // добавление отступа для карточки
    if(e.target.closest('.card')) {
        // определяем подэлемент
        this.subElement = e.target.closest('.card');
        this.subElement.style.cursor = 'grabbing';
        // вносим в крайний активный подэлемент если пусо
        if(!this.lastSubElement) this.lastSubElement = this.subElement;

        // если подэлемент меняется, то у прошлого margin убираем
        if(this.lastSubElement && this.subElement !== this.lastSubElement) {
            this.lastSubElement.style.marginBottom = '';
            this.lastSubElement.style.marginTop = '';

            this.lastSubElement.style.cursor = 'pointer';
        }

        // определяем центр подэлемента
        this.subElementCenter = this.subElement.offsetHeight / 2;
        
        // определяем выше или ниже центра находится курсор
        if(e.offsetY > this.subElementCenter) {
            if(this.subElement.style.marginTop) this.subElement.style.marginTop = ``;
            this.subElement.style.marginBottom = `${this.activeCard.offsetHeight}px`;

            this.lastSubElement = this.subElement;
        } else {
            this.subElement.style.marginTop = `${this.activeCard.offsetHeight}px`;
            if(this.subElement.style.marginBottom) this.subElement.style.marginBottom = ``;

            this.lastSubElement = this.subElement;
        }
        
    }
  }

  onMouseDown(e) {
    

    if(e.target.closest('.card') && !e.target.matches('.delete-card')) {
        e.preventDefault();

        this.activeCard = e.target.closest('.card');
    
        const widthEl = this.activeCard.offsetWidth;
        
        // Меняем курсор
        this.widget.style.cursor = 'grabbing';

        // отступ положения курсора от края элемента
        this.takeIndentX = e.offsetX;
        this.takeIndentY = e.offsetY;

        this.activeCard.style.width = `${widthEl}px`;
        this.activeCard.classList.add('move-card');

        // получаем координаты для позиционирования карточки
        // для того чтобы курсор оставался где схватили
        let x = e.clientX - this.widget.offsetLeft - this.takeIndentX;
        let y = e.clientY - this.widget.offsetTop - this.takeIndentY;
        
        // присвоение координат
        this.activeCard.style.top = `${y}px`;
        this.activeCard.style.left = `${x}px`;

        this.widget.removeEventListener('mousedown', this.onMouseDown);
        this.widget.addEventListener('mousemove', this.onMouseOver);
        document.addEventListener('mouseup', this.onMouseUp);
    }
    
    
  }

  onMouseUp(e) {

    let activeColumn;
    let activeCards;

    
    if(this.activeCard && e.target.closest('.column')) {
      // в случае если колонка пустая, добавляем по блоку cards
        activeColumn = e.target.closest('.column');
        activeCards = activeColumn.querySelector('.cards');
    }

    // в случае если движения мыши не было и элементы пустые
    if(!this.subElement || !this.lastSubElement) {
        this.subElement = e.target.closest('.card');
        this.lastSubElement = this.subElement;
    }

    // ращитываем отступ центра подэлемента от верха экрана
    let coordsSubElement
    if(this.lastSubElement) {      
      // отступ центра элемента от верха, по факту меняется
      coordsSubElement = this.lastSubElement.offsetHeight / 2 + this.lastSubElement.offsetTop + this.widget.offsetTop;
    }
   
    // размещение элемента относительно подэлемента
    if(this.activeCard && e.clientY > coordsSubElement && this.subElementCenter && activeCards.children.length > 0) {
      // ниже 
      this.lastSubElement.after(this.activeCard);
      this.saveState.save(this.widget);
    } else if(this.activeCard && e.clientY < coordsSubElement && this.subElementCenter && activeCards.children.length > 0) {
      // выше
      this.lastSubElement.before(this.activeCard);
      this.saveState.save(this.widget);
    } else if(this.activeCard && activeCards && activeCards.children.length === 0) {
      // если нет в блоке карточек
      activeCards.append(this.activeCard);
      this.saveState.save(this.widget);
    } else if(this.activeCard && activeCards && !this.subElementCenter) {
      activeCards.append(this.activeCard);
    }

    

    if(this.activeCard) {
        this.widget.style.cursor = 'default';
        if(this.subElement) this.subElement.style.cursor = 'pointer'; // ERROR...
        
        this.activeCard.style.width = ``;
        this.activeCard.classList.remove('move-card');
        this.activeCard.style.top = ``;
        this.activeCard.style.left = ``;

        // убираем margin при отпускании кнопки
        if(this.subElement && this.subElement.style.marginTop) this.subElement.style.marginTop = ``;
        if(this.subElement && this.subElement.style.marginBottom) this.subElement.style.marginBottom = ``;

        

        this.activeCard = null;
        this.lastSubElement = null;
        this.subElement = null;
            
    }

    

    this.widget.addEventListener('mousedown', this.onMouseDown);
    this.widget.removeEventListener('mousemove', this.onMouseOver);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}

export default class SaveState {
  constructor() {
    this.columns = [
      {
        title: 'TODO',
        classCard: 'todo',
        cards: [
          'any text 1 any text 1 any text 1 any text 1',
          'any text 2 any text 2 any text 2 any text 2 any text 2 any text 2 any text 2',
          'any text 3 any text 3',
          'any text 4',
          'any text 5 any text 5 any text 5 any text 5',
        ],
      },
      {
        title: 'IN PROGRESS',
        classCard: 'in-progress',
        cards: [
          'any text 1 any text 1 any text 1',
          'any text 2 any text 2 any text 2 any text 2 any text 2',
          'any text 3 any text 3',
        ],
      },
      {
        title: 'DONE',
        classCard: 'done',
        cards: [
          'any text 1 any text 1',
        ],
      },
    ];
  }

  // шаблон для загрузки  и отрисовки виджета
  pattern(object) {
    // Создать блок с карточками и наполнить
    const cards = document.createElement('ul');
    cards.classList.add('cards');
    cards.classList.add(`cards-${object.classCard}`);

    object.cards.forEach((el) => {
      // создаем li и наполняем классами  и текстом и append в cards
      const card = document.createElement('li');
      card.classList.add('card');
      card.classList.add(`card-${object.classCard}`);
      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.textContent = `${el}`;
      card.append(cardText);

      const closeCard = document.createElement('div');
      closeCard.classList.add('delete-card');
      closeCard.innerHTML = '&#10006';
      card.append(closeCard);

      cards.append(card);
    });

    const column = document.createElement('li');
    column.classList.add('column');
    column.classList.add(`${object.classCard}`);

    const wrContent = document.createElement('div');
    wrContent.classList.add('wr-content');

    const header = document.createElement('header');
    header.classList.add('header');

    const titleCard = document.createElement('h2');
    titleCard.classList.add('title-column');
    titleCard.textContent = object.title;

    header.append(titleCard);
    wrContent.append(header);
    wrContent.append(cards);

    const wrAddCard = document.createElement('div');
    wrAddCard.classList.add('wr-add-card');

    const linkAddCard = document.createElement('a');
    linkAddCard.setAttribute('href', '#0');
    linkAddCard.classList.add('link-add-card');
    linkAddCard.textContent = '+ Add another card';

    wrAddCard.append(linkAddCard);

    column.append(wrContent);
    column.append(wrAddCard);

    return column;
  }

  save(widget) {
    this.columns = [];

    const columns = widget.querySelectorAll('.column');

    // формируем новый список карт с данными
    columns.forEach((el) => {
      const titleEl = el.querySelector('.title-column').textContent;

      // Обрабатываем title для сохранения класса, для будующих загрузок
      let className = titleEl.toLowerCase();
      className = className.replace(/\s/, '-');

      // собираем список карточек
      const cardslist = el.querySelectorAll('.card-text');

      // собираем массив текстов карточек
      const arrCards = [];
      cardslist.forEach((item) => {
        arrCards.push(item.textContent);
      });

      this.columns.push({
        title: titleEl,
        classCard: className,
        cards: arrCards,
      });
    });

    const json = JSON.stringify(this.columns);

    localStorage.saveWidget = json;
  }

  // удаление карточки
  delete(el) {
    el.remove();
  }

  // добавление карточки
  addCard(cards, value, className) {
    // создаем элемент
    const card = document.createElement('li');
    card.classList.add('card');
    card.classList.add(`card-${className}`); //
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = `${value}`;
    card.append(cardText);

    const closeCard = document.createElement('div');
    closeCard.classList.add('delete-card');
    closeCard.innerHTML = '&#10006';
    card.append(closeCard);

    cards.append(card);
  }

  // Загрузка приложения первый раз и последующие
  load(widget) {
    if (localStorage?.saveWidget) {
      const storage = JSON.parse(localStorage.saveWidget);

      storage.forEach((el) => {
        const column = this.pattern(el);

        widget.append(column);
      });
 
      return;
    }

    this.columns.forEach((el) => {
      const column = this.pattern(el);

      widget.append(column);
    });
  }
}

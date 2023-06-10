import ControlWidget from './controlWidget';
import SaveState from './saveState';
import ControlAddForm from './controlAddForm';
import Cursor from './cursor';

const widget = document.querySelector('.wr-columns');
const addForm = document.querySelector('.wr-add-form');

const controlWidget = new ControlWidget(
  widget,
  new SaveState(),
  new ControlAddForm(addForm),
  new Cursor(),
);

controlWidget.init();

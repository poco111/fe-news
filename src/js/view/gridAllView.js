import { REFERENCE } from '../constant/dom.js';

export default class GridAllView {
  _gridPress;
  _pressName;
  _subPopupWrap;
  _noSubPopupWrap;

  constructor(gridAllModel, gridSubModel) {
    this._gridAllModel = gridAllModel;
    this._girdSubModel = gridSubModel;
    this._gridAllModel.subscribe(this.render.bind(this));
    this.render();
  }

  async render() {
    const gridAllSection = this.getMarkUp(await this._gridAllModel.getData());
    const parentElem = REFERENCE.NS_CONTAINER.querySelector('.newssection_view');
    parentElem.innerHTML = '';
    parentElem.insertAdjacentHTML('afterbegin', gridAllSection);
    this.setEvent();
  }

  getMarkUp(data) {
    return (
      data.reduce((acc, cur) => {
        acc += `<div class="grid_items">
        <a class="grid_press"> <img class="press_logo" src="${cur.logoImgSrc}" alt="${cur.pressName}"/> </a>
        <a class="sub_popup_wrap hidden"><img class="sub_button" src="/src/asset/newsSectionGridSubButton.svg"></a>
        <a class="nosub_popup_wrap hidden"><img class="nosub_button" src="/src/asset/newsSectionGridNoSubButton.svg"></a>
        </div>`;
        return acc;
      }, `<div class="newssection_view_grid">`) + `</div>`
    );
  }

  isSubscribe() {
    return this._girdSubModel.containsData(this._pressName);
  }

  setSelectedGridSection(gridContainer) {
    this._gridPress = gridContainer.querySelector('.grid_press');
    this._pressName = this._gridPress.querySelector('.press_logo').alt;
    this._subPopupWrap = gridContainer.querySelector('.sub_popup_wrap');
    this._noSubPopupWrap = gridContainer.querySelector('.nosub_popup_wrap');
  }

  gridSectionMouseOverEventHandler({ target }) {
    const gridContainer = target.closest('.grid_items');
    if (!gridContainer) return;
    this.setSelectedGridSection(gridContainer);

    this._gridPress.classList.add('hidden');
    switch (this.isSubscribe()) {
      case true:
        this._noSubPopupWrap.classList.remove('hidden');
        break;
      case false:
        this._subPopupWrap.classList.remove('hidden');
        break;
    }
  }

  gridSectionMouseOutEventHandler() {
    this._gridPress.classList.remove('hidden');
    this._noSubPopupWrap.classList.add('hidden');
    this._subPopupWrap.classList.add('hidden');
  }

  subButtonHandler() {
    const data = this._gridAllModel.getFilterData(this._pressName);
    this._girdSubModel.setSubData(data);

    this._subPopupWrap.classList.add('hidden');
    this._noSubPopupWrap.classList.remove('hidden');
  }

  noSubButtonHandler() {}

  gridSectionClickEventHandler({ target }) {
    if (!target.classList.contains('sub_button') && !target.classList.contains('nosub_button'))
      return;

    target.classList.contains('sub_button') ? this.subButtonHandler() : this.noSubButtonHandler();
  }

  setEvent() {
    const parentElem = REFERENCE.NS_CONTAINER.querySelector('.newssection_view_grid');
    parentElem.addEventListener('mouseover', this.gridSectionMouseOverEventHandler.bind(this));
    parentElem.addEventListener('mouseout', this.gridSectionMouseOutEventHandler.bind(this));
    parentElem.addEventListener('click', this.gridSectionClickEventHandler.bind(this));
  }
}

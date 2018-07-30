class Tab {
  constructor(selector) {
    this.elements = $(selector)
    this.init()
    this.bindEvents()
  }
  init() {
    Array
      .from(this.elements)
      .map((element, index) => {
        $(element)
          .children('.tab-nav')
          .children()
          .eq(0)
          .addClass('active')
        $(element)
          .children('.tab-panels')
          .children()
          .eq(0)
          .addClass('active')
      })
  }
  bindEvents() {
    this.elements.on('click', '.tab-nav>li', e => {
      let $li = $(e.currentTarget)
      let index = $li.index()
      $li
        .addClass('active')
        .siblings()
        .removeClass('active')
      $li
        .closest('.tab')
        .find('.tab-panels')
        .children()
        .eq(index)
        .addClass('active')
        .siblings()
        .removeClass('active')
    })
  }
}

new Tab('.tab')


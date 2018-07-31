class Sticky {
  constructor(selector, offset = 0) {
    this.elements = $(selector)
    this.offset = offset
    this.addPlaceholder()
    this.cacheOffsets()
    this.listenToScroll()
  }
  addPlaceholder() {

    this.elements.each((index, element) => {
      $(element).wrap('<div class="stickyPlaceholder"></div>')
      $(element).parent().height($(element).height())
    })
  }
  cacheOffsets() {
    this.offsets = []
    this.elements.each((index, element) => {
      this.offsets[index] = $(element).offset()
    })
  }
  listenToScroll() {
    $(window).on('scroll', () => {
      var scrollY = window.scrollY
      this.elements.each((index, element) => {
        var $element = $(element)
        if (scrollY + this.offset > this.offsets[index].top) {
          $element.addClass('sticky')
            .css({top: this.offset})
        } else {
          $element.removeClass('sticky')
        }
      })
    })
  }
}

new Sticky('.topbar')
new Sticky('.download', 70)

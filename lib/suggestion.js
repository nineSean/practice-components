// 1.监听input框input事件
// 2.获取input.value向https://api.github.com/search/repositories接口请求数据
// 3.通过节流防止无意义的search
// 4.获取数据后拼接html，插入到input框下方作为suggestion
// 5.实现鼠标点选
// 以上为写代码前的思路，最后优化完的代码思路有所变化
class Suggestion {
  constructor(options){
    this.$input = $(options.input)
    this.search = options.search
    this.showQuantity = options.showQuantity || 8
    this.loadingTemplate = options.loadingTemplate || '<p class="suggestion-loading">加载中...</p>'
    this.blurHandler = () => {
      this.$list.addClass('hide')
    }
    this.init()
    this.bindEvents()
  }
  init(){
    this.$input.after($(this.template())).remove()
    this.$input = $('#sean-suggestion input')
    this.$list = $('#sean-suggestion .suggestion-list').addClass('hide')
    this.$loading = $('#sean-suggestion .suggestion-loading').addClass('hide')
  }
  bindEvents(){
    let timeId
    this.$input.on('input', e => {
      this.$list.addClass('hide')
      if(timeId) clearTimeout(timeId)
      timeId = setTimeout(() => {
        this.$loading.removeClass('hide')
        if(!e.currentTarget.value) {
          this.$list.addClass('hide')
          this.$loading.addClass('hide')
          return
        }
        this.search(e.currentTarget.value, this.update.bind(this))
      }, 500)
    })
    this.$input.on('blur', this.blurHandler)
    this.$input.on('focus', e => {
      !!e.currentTarget.value ? this.$list.removeClass('hide') : 1
    })
    this.$list.on('mouseenter', e => {
      this.$input.off('blur', this.blurHandler)
    })
    this.$list.on('mouseleave', e => {
      this.$input.on('blur', this.blurHandler)
    })
    this.$list.on('click', 'li', e => {
      this.$input.val($(e.target).text()).focus()
      this.website = this.data.items[this.$list.children('li').index(e.target)].svn_url
      this.$input.trigger($.Event('keydown', {keyCode: 13}))
      this.search(this.$input.val(), this.update.bind(this), (() => {
        this.$list.addClass('hide')
      }).bind(this))
    })
    this.$input.on('keydown', e => {
      switch (e.keyCode || e.which || e.charCode){
        case 13:
          if(!this.website) return
          try{
            window.open(this.website)
          }catch(error){
            this.openWebsite(this.website)
          }
          this.$input.get(0).blur()
          this.$list.addClass('hide')
          break
        case 27:
          this.$input.get(0).blur()
          break
        case 9:
          this.$input.val(this.data.items[0].name)
          this.$input.get(0).blur()
      }
    })
  }
  update(data){
    let lengthDiff, fakeItems
    let emptyNameObj = {name: ''}
    this.$loading.addClass('hide')
    this.$list.removeClass('hide')
    data.items.splice(this.showQuantity)
    this.data = data
    fakeItems = [...data.items]
    lengthDiff = this.showQuantity - data.items.length
    lengthDiff ? Array.from(Array(lengthDiff)).forEach(() => fakeItems.push(emptyNameObj)) : 1
    fakeItems.forEach((item, index) => {
      this.$list.children('li').eq(index).text(item.name)
    })
    data.items.length ? this.website = this.data.items[0].svn_url : this.$list.addClass('hide')
  }
  template(){
    return `
      <div id="sean-suggestion">
        ${this.$input[0].outerHTML}
        ${this.loadingTemplate}
        <ul class="suggestion-list">
          ${Array.from(Array(this.showQuantity)).map(() => '<li></li>').join('\n')}
        </ul>
      </div>
    `
  }
  openWebsite(url){
    $('body').append($(`<a href=${url} id="goto" style="display: none" target="_blank"></a>`))
    $('#goto').get(0).click()
    $('#goto').remove()
  }
}

var suggestion = new Suggestion({
  input: 'input',
  search(keyword, callback , callback2) {
    $.ajax({
      url: 'https://api.github.com/search/repositories',
      data: {
        q: keyword
      }
    }).done(data => {
      callback(data)
      callback2 ? callback2() : 1
    }).fail(e => {
      console.log(e)
    })
  }

})

//待优化
//1.添加上下键选择
//2.某些状态切换任然不完美，当搜索结果的列表为空时再连续触发blur、focus事件后会显示list外边框（也许在解决第3点又更好的方案后能解决）
//3.对于loading与list是否显现的状态切换代码交织在各个函数中，之后有更好的方案再优化

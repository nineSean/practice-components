
// 1. 准备HTML
// 2. 绑定事件(另一种思路是把事件绑定放在生成buttonsString遍历时)
// 3. 挂载入页面

class Dialog{
  constructor(options){
    this.options = options
    this._template()
    this._bindEvents()
    this._mount()
  }
  _template({buttons, title, content, className} = this.options){
    let $div = this.$div = $('<div id="sean-dialog"></div>').addClass(className)
    let buttonsString = buttons.reduce((acc, cur)=> acc + `
       <button>${cur.name}</button>`, '')
    $div.html(`
      <div class="wrapper">
        <header>${title}</header>
        <main>${content}</main>
        <footer>
          ${buttonsString}
        </footer>
      </div>
    `)
  }
  _bindEvents({buttons} = this.options){
    this.$div.on('click', e=>{
      if(e.target.tagName === 'BUTTON'){
        buttons[$(e.target).index()].action()
      }
    })
  }
  _mount({$div} = this){
    $('body').append($div)
  }
  unmount({$div} = this){
    $div.remove()
  }
}



clickme.onclick = e=>{
  var dialog = new Dialog({
    title: '标题',
    content: '我是内容',
    className: 'user-dialog',
    buttons: [{
      name: '确定',
      action() {
        setTimeout(() => {
          dialog.unmount()
        }, 3000)
      }
    }, {
      name: '取消',
      action() {
        dialog.unmount()
      }
    }]
  })
}


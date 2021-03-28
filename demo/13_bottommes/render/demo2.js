const btn = this.document.querySelector('#btn');
const BrowserWindow = require('electron').remote.BrowserWindow;

window.onload = function() {
    btn.onclick = ()=>{
        newWin = new BrowserWindow({
            width:500,
            heigth:500
        });
        newWin.loadFile('yellow.html');
        newWin.on('close', ()=>{
            newWin = null;
        })
    }
}

const {remote} = require('electron')
const ipc = require('electron').ipcRenderer
var rightTemplate = [
    {
        label:'复制，开发者',
        accelerator:'ctrl+c',
        click:()=>{
            console.log(123)
            ipc.send('debug-message', 'ping')   // 发消息
        }
    },
    {label:'粘贴', accelerator:'ctrl+v'}
]

var m = remote.Menu.buildFromTemplate(rightTemplate)


// 右击事件
window.addEventListener('contextmenu', function(e){
    e.preventDefault()  // 默认响应事件组织掉

    // 使用右键模板
    m.popup({window:remote.getCurrentWindow()})
})
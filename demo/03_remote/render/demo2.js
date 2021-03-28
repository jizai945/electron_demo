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
var electron = require('electron');

var app = electron.app;  // 应用app
var BrowserWindow = electron.BrowserWindow;  // 窗口引用
var globalShortcut = electron.globalShortcut // 不在main.js需要使用remote

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowserWindow({
        width:1000,
        height:800,
        webPreferences:{
            nodeIntegration:true,  // nodejs可以在渲染进程中使用
            contextIsolation: false,  
            enableRemoteModule: true,   // remote引用不成功的问题
        }  
    });
    globalShortcut.register('ctrl+e', ()=>{
        mainWindow.loadURL('http://www.baidu.com')
    })
    let isRegister = globalShortcut.isRegistered('ctrl+e')?'Register Sucess':'Register fail'
    console.log(isRegister)   

    // mainWindow.webContents.openDevTools()
    require('./main/menu.js');  // 加载菜单js
    // 主窗口加载html页面
    mainWindow.loadFile('demo7.html');

    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})

const ipc = require('electron').ipcMain

ipc.on('debug-message', function (event, arg) {
    mainWindow.webContents.openDevTools()
  })

app.on('will-quit', function(){
    // 注销全局快捷键方法
    globalShortcut.unregister('ctrl+e')
    globalShortcut.unregisterAll()
})
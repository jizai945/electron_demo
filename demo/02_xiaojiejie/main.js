var electron = require('electron');

var app = electron.app;  // 应用app
var BrowerWindow = electron.BrowserWindow;  // 窗口引用

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowerWindow({
        width:800,
        height:800,
        webPreferences:{
            nodeIntegration:true,  // nodejs可以在渲染进程中使用
            contextIsolation: false,  
        }  
        
    });
    // 主窗口加载html页面
    mainWindow.loadFile('index.html');
    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})
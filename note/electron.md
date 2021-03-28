# ELECTRON笔记

参考教程:http://www.jspang.com/detailed?id=62#toc220

## 简介

使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序

允许前端开发着使用html js css开发桌面应用

electron = chrominum + node.js + native api

chrominum :谷歌浏览器，强大的ui能力

node.js ： 底层的操作能力，文件读写等，使用npm管理包

native api:跨平台和桌面原生的能力



## 开发环境搭建

1. 网下载node.js

   通过`npm -v node -v`查看版本呢

2. 入到工程目录 输入命令 `npm init -y` ，生成package.json文件

3. 局部开发环境安装electron ，命令`npm install electron --save-dev`

   -> 全局安装命令`npm install -g electron`

4. 检测是否安装成功`npx electron -v`

5. `./node_modules/.bin/electron`检测是否安装成功



## electron编写helloworld应用程序

程序 01_helloworld

创建helloworld的页面 index.html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    Hello World
</body>
</html>
```



主进程：main.js：

```javascript
var electron = require('electron');

var app = electron.app;  // 应用app
var BrowerWindow = electron.BrowserWindow;  // 窗口引用

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowerWindow({
        width:300,
        height:300
    });
    // 主窗口加载html页面
    mainWindow.loadFile('index.html');
    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})
```

通过命令`npm init --yes`生成的package.json中main:"main.js"

运行程序: 

+ 全局: `electron .`
+ 局部: `./node_modules/.bin/electron .`



## electron 编写小程序2

程序 02_xiaojiejie

主进程：package.json里面 main对应的哪个js文件，就是主进程，有且只有一个

webpreferences:{NodeIterator:true} 

渲染进程：每一个打开的窗口都是一个渲染进程



main.js:

注意webPreferences中的属性，否则require不成功

```javascript
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
```



## electron 中 remote模块讲解

程序 03_remote

渲染进程正常情况下无法使用BrowerWindow去新创建一个窗口，需要用到remote

当我们知道了Electron有主进程和渲染进程后，我们还要知道一件事，就是Electron的API方法和模块也是分为可以在主进程和渲染进程中使用。那如果我们想在渲染进程中使用主进程中的模块方法时，可以使用`Electron Remote`解决在渲染和主进程间的通讯。这节我们就实现一个通过Web中的按钮打开新窗口。



const BrowerWindow = require('electron').remote.BrowerWindow;



enableRemoteModule: true,  // remote引用不成功的问题



main.js:

```javascript
var electron = require('electron');

var app = electron.app;  // 应用app
var BrowserWindow = electron.BrowserWindow;  // 窗口引用

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowserWindow({
        width:800,
        height:800,
        webPreferences:{
            nodeIntegration:true,  // nodejs可以在渲染进程中使用
            contextIsolation: false,  
            enableRemoteModule: true,   // remote引用不成功的问题
        }  
        
    });
    // 主窗口加载html页面
    mainWindow.loadFile('demo2.html');
    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})
```



demo2.js:

```javascript
const btn = this.document.querySelector('#btn');
const BrowserWindow =require('electron').remote.BrowserWindow;

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
```



## electron中菜单的创建和绑定事件

参考 04_menu



menu.js:

```javascript
const {Menu, BrowserWindow} = require('electron');
// 菜单的模板
var template = [
    {
        label:'菜单1',
        submenu:[
            {
                label:'子菜单1',
                accelerator: 'ctrl+n', // 快捷键
                click:()=>{
                    // 这个实在主进程中，所以可以直接使用BrowserWindow
                    var win =  new BrowserWindow({
                        width:500,
                        height:500,
                        webPreferences:{
                            nodeIntegration: true
                        }
                    })
                    win.loadFile('yellow.html')
                    win.on('close', ()=>{
                        win = null
                    })
                }
            },
            {label:'子菜单2'},
        ]
    },
    {
        label:'菜单2',
        submenu:[
            {label:'子菜单3'},
            {label:'子菜单4'},
        ]
    }
]

// 构建一下模板
var m = Menu.buildFromTemplate(template);
// 设置应用程序的模板
Menu.setApplicationMenu(m);
```

require('./main/menu.js');

main.js:

```javascript
var electron = require('electron');

var app = electron.app;  // 应用app
var BrowserWindow = electron.BrowserWindow;  // 窗口引用

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowserWindow({
        width:800,
        height:800,
        webPreferences:{
            nodeIntegration:true,  // nodejs可以在渲染进程中使用
            contextIsolation: false,  
            enableRemoteModule: true,   // remote引用不成功的问题
        }  
        
    });
    require('./main/menu.js');
    // 主窗口加载html页面
    mainWindow.loadFile('demo2.html');
    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})
```



## electron 中右键菜单的制作

参考05_youjian



// 右击事件

window.addEventListener('contextmenu', function(e){

  e.preventDefault() // 默认响应事件组织掉

})

默认打开开发者工具:

mainWindow.webContents.openDevTools()



demo2.js:

```javascript
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
```



main.js:

```javascript
var electron = require('electron');

var app = electron.app;  // 应用app
var BrowserWindow = electron.BrowserWindow;  // 窗口引用

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowserWindow({
        width:800,
        height:800,
        webPreferences:{
            nodeIntegration:true,  // nodejs可以在渲染进程中使用
            contextIsolation: false,  
            enableRemoteModule: true,   // remote引用不成功的问题
        }  
    });
    // mainWindow.webContents.openDevTools()
    require('./main/menu.js');
    // 主窗口加载html页面
    mainWindow.loadFile('demo2.html');
    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})

const ipc = require('electron').ipcMain

ipc.on('debug-message', function (event, arg) {
    mainWindow.webContents.openDevTools()
  })
```



## electron通过链接打开浏览器

参考 06_lianjie

默认是在应用程序里面打开链接网页

`<a id="aHref" href="http://www.baidu.com">百度</a>`

要使用electron里面的shell



demo3.js:

```javascript
var {shell} = require('electron')

var aHref = document.querySelector('#aHref')

aHref.onclick = function(e){
    // 阻止默认行为
    e.preventDefault()
    var href = this.getAttribute('href')
    // shell工具
    shell.openExternal(href)
}
```



## electron 中嵌入网页和打开子窗口

参考 07_subwindow



使用BrowserView

```javascript
    // BrowserView
    var BrowserView = electron.BrowserView
    var view = new BrowserView()
    mainWindow.setBrowserView(view)
    view.setBounds({x:0,y:120,width:1000,height:680}) // 设置样式
    view.webContents.loadURL('http://www.baidu.com')
```



打开子窗口

window.open



main.js:

```javascript
var electron = require('electron');

var app = electron.app;  // 应用app
var BrowserWindow = electron.BrowserWindow;  // 窗口引用

var mainWindow = null;  // 申明要打开的主窗口

// app就绪后回调
app.on('ready', ()=>{
    // 设置窗口属性
    mainWindow = new BrowserWindow({
        width:800,
        height:800,
        webPreferences:{
            nodeIntegration:true,  // nodejs可以在渲染进程中使用
            contextIsolation: false,  
            enableRemoteModule: true,   // remote引用不成功的问题
        }  
    });
    // mainWindow.webContents.openDevTools()
    require('./main/menu.js');  // 加载菜单js
    // 主窗口加载html页面
    mainWindow.loadFile('demo3.html');

    // BrowserView 嵌入子网页
    var BrowserView = electron.BrowserView
    var view = new BrowserView()
    mainWindow.setBrowserView(view)
    view.setBounds({x:0,y:120,width:1000,height:680}) // 设置样式
    view.webContents.loadURL('http://www.baidu.com')

    // 打开子窗口 window.open

    // 关闭事件,防止内存泄漏
    mainWindow.on('closed', ()=>{
        mainWindow = null
    })
})

const ipc = require('electron').ipcMain

ipc.on('debug-message', function (event, arg) {
    mainWindow.webContents.openDevTools()
  })
```



demo3.js:

```javascript
var {shell} = require('electron')

var aHref = document.querySelector('#aHref')

aHref.onclick = function(e){
    // 阻止默认行为
    e.preventDefault()
    var href = this.getAttribute('href')
    // shell工具
    shell.openExternal(href)
}

var mybtn = document.querySelector('#mybtn')
mybtn.onclick = function(e){
    window.open('http://www.baidu.com')
}
```



## electron 子窗口向父窗口传递信息

参考 08_message



window.opener.postMessage('我是子窗口传递过来的信息')



popup_page.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h2>我是弹出子窗口</h2>
    <button id='popbtn'>向父窗口传递信息</button>
</body>
<script>
    var popbtn = this.document.querySelector('#popbtn')
    popbtn.onclick = function(e){
        window.opener.postMessage('我是子窗口传递过来的信息')
    }
</script>
</html>
```



## electron 选择文件对话框使用

参考 09_choicefiledialog



demo4.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id='openBtn'>打开图片</button>
    <img id='images' style="width: 100%;"/>
</body>
<script>
    const {dialog} = require('electron').remote
    var openBtn = document.getElementById('openBtn')
    openBtn.onclick = function(){
        // dialog.showOpenDialogSync    // 同步
        dialog.showOpenDialog({
            title:'请选择照片',
            defaultPath:'test.html', // 默认打开的文件
            filters:[{name:'图片', extensions:['jpg']}], // 过滤文件格式
            buttonLabel:'自定义打开',
        }).then(result=>{
            console.log(result)
            if (result.canceled == false) {
                let image = document.getElementById('images')
                image.setAttribute('src', result.filePaths[0])
            }           
        }).catch(err=>{
            // 异常捕获
            console.log(err)
        })
    }
</script>
</html>
```



## electron 保持文件对话框

参考 10_savefiledialog





```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id='openBtn'>打开图片</button>
    <button id='saveBtn'>保存文件</button>
    <img id='images' style="width: 100%;"/>
</body>
<script>
    const {dialog} = require('electron').remote
    const fs = require('fs')
    var openBtn = document.getElementById('openBtn')
    openBtn.onclick = function(){
        // dialog.showOpenDialogSync    // 同步
        dialog.showOpenDialog({
            title:'请选择照片',
            defaultPath:'test.html', // 默认打开的文件
            filters:[{name:'图片', extensions:['jpg']}], // 过滤文件格式
            buttonLabel:'自定义打开',
        }).then(result=>{
            console.log(result)
            if (result.canceled == false) {
                let image = document.getElementById('images')
                image.setAttribute('src', result.filePaths[0])
            }           
        }).catch(err=>{
            // 异常捕获
            console.log(err)
        })
    }

    var saveBtn = document.getElementById('saveBtn')
    saveBtn.onclick = function(){
        dialog.showSaveDialog({
            title:'保存文件'
        }).then(result=>{
            console.log(result)
            // 没有点击取消
            if (result.canceled == false) {
                fs.writeFileSync(result.filePath, 'test write')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
</script>
</html>
```



## electron 消息对话框操作

参考 11_messagebox



```javascript
    var messageBtn = document.getElementById('messageBtn')
    messageBtn.onclick = function (){
        dialog.showMessageBox({
            type:'warning',
            title:'测试',
            message:'测试开始?',
            buttons:['开始', '停止']
        }).then(result=>{
            console.log(result)
        })
    }
```



## electron 断网提醒功能制作



参考 12_wlan

```javascript
    // online offline
    window.addEventListener('online', function(){
        alert('网络恢复了')
    })

    window.addEventListener('offline', function(){
        alert('断网了')
    })
```



## electron 底部通知消息制作

参考 13_bottommes



```javascript
    var notifyBtn = document.getElementById('notifyBtn')
    var option = {
        title:'我的标题',
        body:'没事通知一下'
    }
    notifyBtn.onclick=function(){
        new window.Notification(option.title, option)
    }
```



## electron注册全局快捷键

参考 14_shortcutkey

main.js

```javascript
var globalShortcut = electron.globalShortcut // 不在main.js需要使用remote

globalShortcut.register('ctrl+e', ()=>{
        mainWindow.loadURL('http://www.baidu.com')
    })
    let isRegister = globalShortcut.isRegistered('ctrl+e')?'Register Sucess':'Register fail'
    console.log(isRegister) 

```

注销

```javascript
app.on('will-quit', function(){
    // 注销全局快捷键方法
    globalShortcut.unregister('ctrl+e')
    globalShortcut.unregisterAll()
})
```



## electron 剪切板功能的使用

参考 15_shear
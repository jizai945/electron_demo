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
    },
    {
        label:'设置',
        submenu:[
            {
                label: '开发者模式', // 打开开发者工具
                accelerator: (function() {
                //   if (process.platform === 'darwin') { return 'Alt+Command+I' } else { return 'Ctrl+Shift+I' }
                    return 'f12'
                })(),
                click: function(item, focusedWindow) {
                  if (focusedWindow) { focusedWindow.toggleDevTools() }
                }
            }
        ]       
    }
]

// 构建一下模板
var m = Menu.buildFromTemplate(template);
// 设置应用程序的模板
Menu.setApplicationMenu(m);
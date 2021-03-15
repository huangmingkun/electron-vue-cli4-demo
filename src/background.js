'use strict';

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import './js/main/ipc-communication.js' // 监听渲染进程ipc

// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'hmk1', privileges: { secure: true, standard: true } }
])

app.setAsDefaultProtocolClient("hmk",process.execPath);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // 是否显示自带的窗口
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      enableRemoteModule: true, // 是否开启remote远程通信（eg：渲染进程获取主进程实例来创建新的窗口）
      nodeIntegration: true // 开启node为true后，渲染进程中引入模块，改成使用window.require引入，eg：const { ipcRenderer } = window.require('electron')
      // 默认浏览器是不允许调用node的原生插件
      // 只是需要调用ipc进行通讯时不需要进行上述nodeIntegration: true操作
      // 既然渲染进程默认不支持调用，那就在预执行中获取对象，然后存到window对象中，需要用的时候从window调用就好了
      // https://blog.csdn.net/qq_40488121/article/details/108128371可见链接详细做法(该方法还没实现，无法预加载js文件，待研究)
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // 根据环境变量来判断是测试环境，开启调试工具
    // right：右侧打开；bottom：底部打开；left：左侧打开；undocked/detach：分离打开；
    if (!process.env.IS_TEST) win.webContents.openDevTools({mode:'detach'})
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  // webContents.send通信--需要先设置其loadURL(加载的页面)
  win.webContents.send('webContents-send', '使用webContents.send，主进程向渲染进程传递信息');
  // 去除原生顶部菜单栏
  win.setMenu(null);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // 禁用安装vue浏览器调试工具（需要翻墙，否则会影响编译项目速度）
      // await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

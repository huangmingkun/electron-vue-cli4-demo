<template>
  <div class="main">
    <div class="bottom-container">
      <div class="sidebar">
        <div class="btn-top">
          <div class="btn-item">
            <p class="btn-icon">X</p>
            <p class="btn-content">消息</p>
          </div>
          <div class="btn-item">
            <p class="btn-icon">X</p>
            <p class="btn-content">文档</p>
          </div>
          <div class="btn-item">
            <p class="btn-icon">X</p>
            <p class="btn-content">工作台</p>
          </div>
          <div class="btn-item">
            <p class="btn-icon">X</p>
            <p class="btn-content">通讯录</p>
          </div>
        </div>
        <div class="btn-bottom">
          <div class="btn-item" @click="dateMethod">
            <p class="btn-icon">X</p>
            <p class="btn-content">日历</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//在渲染器进程 (网页) 中。
const { ipcRenderer } = window.require('electron');
const { BrowserWindow } = window.require('electron').remote;
const app = window.require('electron').remote.app;
console.log('远程模块--app', app);
const getCurrentWindow = window.require('electron').remote.getCurrentWindow(); // 返回 BrowserWindow 即此网页所属的窗口
console.log('远程模块--getCurrentWindow', getCurrentWindow);
const getCurrentWebContents = window.require('electron').remote.getCurrentWebContents(); // 返回 WebContents 即此网页的 web 内容
console.log('远程模块--getCurrentWebContents', getCurrentWebContents);
const getGlobal = window.require('electron').remote.getGlobal(name); // 返回主进程中 name (例如 global[name]) 的全局变量
console.log('远程模块--getGlobal', getGlobal);
const process = window.require('electron').remote.process; // 主进程中的 process 对象。这与 remote.getGlobal('process') 相同, 但已被缓存。
console.log('远程模块--process', process);
export default {
  name: 'LeftSideBar',
  data () {
    return {
    }
  },
  methods: {
      dateMethod () {

          // console.log(ipcRenderer.sendSync('synchronous-message', '发送同步信息'));


          // ipcRenderer.send('asynchronous-message', '给主进程发送异步信息');
          // ipcRenderer.on('asynchronous-reply', (event, arg) => {
          //     console.log(arg) // 在调用时，再用ipcRenderer.on监听主进程传给渲染进程的值，会导致此处打印多次，因此需要在created等生命周期声明一次即可
          // });


          // 主进程添加一次性的 listener。当且仅当下一个消息发送到 channel 时 listener 才会被调用，随后listener会被移除
          // 在此情况，第二次发送同步消息到主进程时，由于主进程没有相应的监听事件，因此项目会一直处于等待回应状态（死机）
          // console.log(ipcRenderer.sendSync('synchronous-message-once', '发送同步信息--监听一次'));
          // 因此，对于一次性的监听事件，不使用同步发送信息
          // ipcRenderer.send('asynchronous-message-once', '给主进程发送异步信息');

          // 需要在主进程设置enableRemoteModule: true、nodeIntegration: true
          let win = new BrowserWindow({ width: 800, height: 600 });
          win.loadURL('https://www.baidu.com');
      },
      initIPCListener () {
          // 如果在调用时候，再用ipcRenderer.on监听主进程，会导致渲染进程获取多个返回值（console.log(arg)打印多次）
          // 因此需要在vue页面声明一次监听即可
          ipcRenderer.on('asynchronous-reply', (event, arg) => {
              console.log(arg)
          });
          ipcRenderer.on('asynchronous-reply-once', (event, arg) => {
              console.log(arg)
          });
          ipcRenderer.on('webContents-send', (event, arg) => {
              console.log(arg)
          });
      }
  },
  created() {
      const that = this;
      // 初始化渲染进程监听事件
      that.initIPCListener()
  }
}
</script>

<style scoped lang="less">
  .text-ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .main {
    width: 70px;
    height: 600px;
    .bottom-container {
      display: flex;
      height: 100%;
      width: 100%;
      .sidebar {
        width: 70px;
        height: 100%;
        background-color: #edeff1;
        display: flex;
        flex-direction: column;
        .btn-top, .btn-bottom {
          padding: 6px 3px;
          flex: 1;
        }
        .btn-item {
          margin: 6px 4px;
          padding: 2px;
          border: 1px solid #d4d1d1;
          border-radius: 7px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          .btn-icon {
            width: 30px;
            height: 30px;
            line-height: 30px;
            margin: auto;
          }
          .btn-content {
            font-size: 12px;
            padding: 3px;
            color: #a9a9a9;
          }
        }
        .btn-item:hover {
          background-color: #dedede;
        }
      }
    }
  }
</style>

const { ipcMain } = require('electron');

const ipcRenderFunctions = {
    'synchronous-message': (event, arg) => {
        console.log(arg);
        event.returnValue = '给渲染进程回应同步信息'
    },
    'asynchronous-message': (event, arg) => {
        console.log(arg);
        event.reply('asynchronous-reply', '给渲染进程回应异步信息')
    },
    'asynchronous-message-once': (event, arg) => {
        // 获取渲染进程传过来的参数
        console.log(arg);
        // 同步回复信息
        // event.returnValue = '对于一次性监听事件，同步消息回应时--会导致死机情况';
        // 异步回复信息
        event.reply('asynchronous-reply-once', '给渲染进程回应异步信息--once')
    },
};

for (let key in ipcRenderFunctions) {
    ipcMain.on(key, ipcRenderFunctions[key]);
}

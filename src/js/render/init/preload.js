import { ipcRenderer } from 'electron'
console.log('preload888888', ipcRenderer)
window.ipcRenderer = ipcRenderer;

import { contextBridge, ipcRenderer } from "electron";

let config: DesktopConfig | null = null;

// Initialize with default values
const defaultConfig: DesktopConfig = {
  firstLaunch: true,
  customFrame: true,
  minimiseToTray: true,
  startMinimisedToTray: false,
  spellchecker: true,
  hardwareAcceleration: true,
  discordRpc: true,
  windowState: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isMaximised: false,
  },
};

ipcRenderer.on("config", (_, data) => {
  config = data;
});

// Set initial config to default values, then update with actual config when received
config = defaultConfig;

contextBridge.exposeInMainWorld("desktopConfig", {
  get: () => config,
  set: (newConfig: DesktopConfig) => ipcRenderer.send("config", newConfig),
  getAutostart() {
    return ipcRenderer.invoke("getAutostart") as Promise<boolean>;
  },
  setAutostart(value: boolean) {
    return ipcRenderer.invoke("setAutostart", value) as Promise<boolean>;
  },
});

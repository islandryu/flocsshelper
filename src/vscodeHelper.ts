import vscode from "vscode";

export function getConfigValue<T>(configName: string, fallBackValue: T): T {
    let settingValue = vscode.workspace.getConfiguration().get(configName) as T;
    return settingValue !== undefined ? settingValue : fallBackValue;
}

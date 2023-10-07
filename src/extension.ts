import * as vscode from 'vscode';
import { Uri } from 'vscode';

async function saveAllExceptUntitled() {
  if (!await vscode.workspace.saveAll(/* includeUntitled */ false)) {
    vscode.window.showErrorMessage('Failed to Save All except Untitled');
  }
  // Always save the active document
  const doc = vscode.window.activeTextEditor?.document;
  if (doc && doc.isUntitled && doc.isDirty) {
    if (!await doc.save()) {
      vscode.window.showErrorMessage('Failed to active document');
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-enhanced-save-all.save-all-except-untitled', saveAllExceptUntitled)
  );
}

export function deactivate() {}

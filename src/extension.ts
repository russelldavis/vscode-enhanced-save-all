import * as vscode from 'vscode';

async function saveAllExceptUntitled() {
  if (!await vscode.workspace.saveAll(/* includeUntitled */ false)) {
    vscode.window.showErrorMessage('Failed to Save All except Untitled');
  }
  // Always save the active document
  const doc = vscode.window.activeTextEditor?.document;
  if (doc && doc.isUntitled && doc.isDirty) {
    // NB: Don't call doc.save() here. There's a weird bug where if the file doesn't exist yet
    // on disk (e.g., from running `code some_new_file`), doc.save() will cause the editor to
    // close after saving. After looking at the source, the full command also seems to handle some
    // extra edge cases that are probably good to cover.
    //
    // Ignore return value, it will be false if the user is prompted for a filename and they cancel
    await vscode.commands.executeCommand('workbench.action.files.save');
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-enhanced-save-all.save-all-except-untitled', saveAllExceptUntitled)
  );
}

export function deactivate() {}

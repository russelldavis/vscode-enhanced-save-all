import * as vscode from 'vscode';

async function saveAllExceptUntitled() {
  // Always save the active document. This ensures even untitled documents are saved when they are
  // active, and also preserves the "force save" behavior for the active document (e.g., run-on-save
  // actions will still run even if the document isn't dirty).
  //
  // NB: Don't call doc.save() here. There's a weird bug where if the file doesn't exist yet
  // on disk (e.g., from running `code some_new_file`), doc.save() will cause the editor to
  // close after saving. After looking at the source, the full command also seems to handle some
  // extra edge cases that are probably good to cover.
  //
  // Ignore return value, it will be false if the user is prompted for a filename and they cancel
  await vscode.commands.executeCommand('workbench.action.files.save');

  // Now, save any remaining dirty, untitled files
  if (!await vscode.workspace.saveAll(/* includeUntitled */ false)) {
    vscode.window.showErrorMessage('Failed to Save All except Untitled');
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-enhanced-save-all.save-all-except-untitled', saveAllExceptUntitled)
  );
}

export function deactivate() {}

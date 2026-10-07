# pi-killword

Adds `Ctrl+Backspace` as an additional binding for Pi's native
`tui.editor.deleteWordBackward` action.

## Install

```sh
pi install npm:pi-killword
```

The extension is a one-shot installer for `Ctrl+Backspace` binding to kill word action (`tui.editor.deleteWordBackward` ). It preserves existing backward-word deletion bindings and updates the Pi agent's `keybindings.json`. After configuring the binding, it asks to remove itself; the default choice is **yes**. Restart Pi, or run `/reload` after the first installation, for the binding to become active. You don't need to keep the extension installed to keep the binding.

Choose **no** if you want to keep the package for inspection or reuse.

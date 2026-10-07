import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { configureKeybindings } from "../src/keybindings.js";

test("adds Ctrl+Backspace while preserving existing bindings", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "pi-killword-"));
  await writeFile(path.join(dir, "keybindings.json"), JSON.stringify({
    "tui.editor.deleteWordBackward": "alt+w",
    "tui.editor.cursorLeft": "ctrl+b",
  }));

  await configureKeybindings(dir);
  await configureKeybindings(dir);

  const config = JSON.parse(await readFile(path.join(dir, "keybindings.json"), "utf8"));
  assert.deepEqual(config["tui.editor.deleteWordBackward"], ["alt+w", "ctrl+backspace"]);
  assert.equal(config["tui.editor.cursorLeft"], "ctrl+b");
});

test("uses Pi defaults when no keybindings exist", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "pi-killword-"));
  await configureKeybindings(dir);
  const config = JSON.parse(await readFile(path.join(dir, "keybindings.json"), "utf8"));
  assert.deepEqual(config["tui.editor.deleteWordBackward"], ["ctrl+w", "alt+backspace", "ctrl+backspace"]);
});

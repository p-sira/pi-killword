import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const ACTION = "tui.editor.deleteWordBackward";
const LEGACY_ACTION = "deleteWordBackward";
const DEFAULT_KEYS = ["ctrl+w", "alt+backspace"];
const EXTRA_KEY = "ctrl+backspace";

function agentDir(env = process.env) {
  return path.resolve(env.PI_CODING_AGENT_DIR || path.join(os.homedir(), ".pi", "agent"));
}

async function readConfig(pathname) {
  try {
    return JSON.parse(await readFile(pathname, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

export async function configureKeybindings(dir = agentDir()) {
  const pathname = path.join(dir, "keybindings.json");
  const config = await readConfig(pathname);
  const configured = config[ACTION] ?? config[LEGACY_ACTION];
  const keys = typeof configured === "string"
    ? [configured]
    : Array.isArray(configured) && configured.every((key) => typeof key === "string")
      ? configured
      : DEFAULT_KEYS;

  if (keys.includes(EXTRA_KEY)) return { changed: false, pathname };

  await mkdir(dir, { recursive: true });
  await writeFile(pathname, `${JSON.stringify({
    ...config,
    [ACTION]: [...keys, EXTRA_KEY],
  }, null, 2)}\n`, "utf8");
  return { changed: true, pathname };
}

export { ACTION, EXTRA_KEY };

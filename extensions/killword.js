import { configureKeybindings } from "../src/keybindings.js";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function offerRemoval(ctx) {
  if (!ctx.hasUI) return;
  const choice = await ctx.ui.select(
    "Ctrl+Backspace was installed successfully, and pi-killword is no longer needed. Remove it?",
    ["Yes (recommended)", "No"],
  );
  if (choice !== "Yes (recommended)") return;
  await rm(packageRoot, { recursive: true, force: true });
  ctx.ui.notify("Ctrl+Backspace is configured. pi-killword removed.", "info");
}

export default function killword(pi) {
  pi.on("session_start", async (_event, ctx) => {
    const result = await configureKeybindings();
    if (result.changed) {
      ctx.ui?.notify?.("Ctrl+Backspace added. Restart Pi or run /reload to apply it.", "info");
    }
    await offerRemoval(ctx);
  });
}

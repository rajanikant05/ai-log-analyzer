export function cleanLogs(logs) {
  return logs
    // remove ANSI colors
    .replace(/\x1b\[[0-9;]*m/g, "")

    // remove excessive empty lines
    .replace(/\n\s*\n/g, "\n")

    // limit huge logs
    .split("\n")
    .slice(-200)
    .join("\n");
}

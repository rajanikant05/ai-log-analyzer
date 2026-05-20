import { knownIssues } from "../data/knownIssues.js";

export function detectKnownIssues(logs) {
  for (const item of knownIssues) {
    if (logs.includes(item.pattern)) {
      return {
        matched: true,
        issue: item.issue,
        suggested_fix: item.fix,
      };
    }
  }

  return { matched: false };
}

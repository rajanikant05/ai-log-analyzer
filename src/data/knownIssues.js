export const knownIssues = [
  {
    pattern: "ECONNREFUSED",
    issue: "Service unavailable",
    fix: "Check target service health"
  },
  {
    pattern: "OOMKilled",
    issue: "Container memory exceeded",
    fix: "Increase memory limits"
  },
  {
    pattern: "CrashLoopBackOff",
    issue: "Kubernetes app crash loop",
    fix: "Inspect container startup logs"
  }
];

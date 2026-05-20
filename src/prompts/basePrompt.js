export function buildBasePrompt(cleanedLogs) {
  return `
You are a senior SRE and DevOps architect.

Analyze logs and return ONLY valid JSON.

Focus especially on:
- GitHub Actions failures
- deployment issues
- infrastructure provisioning
- Kubernetes/container errors
- dependency installation failures

Expected JSON:
{
  "category": "",
  "error": "",
  "root_cause": "",
  "fix": "",
  "severity": "",
  "confidence": "high | medium | low"
}

Recommended categories:
- database: DB connection failures
- network: DNS, timeout
- deployment: rollout issues
- dependency: npm/pip/maven
- infrastructure: Terraform/K8s
- authentication: auth/token
- configuration: env vars
- performance: memory/cpu

Severity rules:
- low -> warnings/non-blocking
- medium -> degraded functionality
- high -> deployment failure/service outage

Example 1:

Logs:
ERROR Connection timeout to postgres database

Response:
{
  "category": "database",
  "error": "Database connection timeout",
  "root_cause": "Postgres database unreachable",
  "fix": "Check database availability and network connectivity",
  "severity": "high",
  "confidence": "high"
}

Example 2:

Logs:
npm install failed due to package-lock mismatch

Response:
{
  "category": "dependency",
  "error": "Dependency lock mismatch",
  "root_cause": "package-lock.json out of sync",
  "fix": "Regenerate lock file and reinstall dependencies",
  "severity": "medium",
  "confidence": "high"
}

Now analyze the following logs:

${cleanedLogs}
`;
}

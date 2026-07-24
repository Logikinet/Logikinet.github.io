/** Sensitive content scan for Studio saves (shared with content-server). */

export type SecretSeverity = "block" | "warn";

export interface SecretFinding {
  type: string;
  severity: SecretSeverity;
  line: number;
  /** Redacted snippet — never full secret */
  hint: string;
  placeholder: string;
}

const RULES: Array<{
  type: string;
  severity: SecretSeverity;
  re: RegExp;
  placeholder: string;
}> = [
  {
    type: "API Key / Token",
    severity: "block",
    re: /\b(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,}|xox[baprs]-[a-zA-Z0-9-]{10,}|AIza[0-9A-Za-z\-_]{20,})\b/g,
    placeholder: "{{API_KEY}}",
  },
  {
    type: "Bearer / Authorization",
    severity: "block",
    re: /\b(Bearer\s+[A-Za-z0-9\-._~+/]+=*|Authorization:\s*\S+)/gi,
    placeholder: "{{API_KEY}}",
  },
  {
    type: "Private key block",
    severity: "block",
    re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    placeholder: "{{PRIVATE_KEY}}",
  },
  {
    type: "Password assignment",
    severity: "block",
    re: /\b(password|passwd|pwd)\s*[=:]\s*['"]?[^\s'"]{6,}/gi,
    placeholder: "{{PASSWORD}}",
  },
  {
    type: "Cookie header",
    severity: "block",
    re: /\bCookie:\s*[^\n]{10,}/gi,
    placeholder: "{{COOKIE}}",
  },
  {
    type: "Connection string",
    severity: "block",
    re: /\b(mongodb(\+srv)?:\/\/|postgres(ql)?:\/\/|mysql:\/\/|redis:\/\/)[^\s'"]+/gi,
    placeholder: "{{DATABASE_URL}}",
  },
  {
    type: "中国大陆手机号",
    severity: "warn",
    re: /(?<!\d)1[3-9]\d{9}(?!\d)/g,
    placeholder: "{{PHONE}}",
  },
  {
    type: "身份证号",
    severity: "block",
    re: /(?<!\d)[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx](?!\d)/g,
    placeholder: "{{ID_NUMBER}}",
  },
  {
    type: "Email",
    severity: "warn",
    re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    placeholder: "{{USER_EMAIL}}",
  },
  {
    type: "本机绝对路径",
    severity: "block",
    re: /(?:[A-Za-z]:\\|\/(?:Users|home|root|var|etc|opt)\/)[^\s'"`]+/g,
    placeholder: "{{PROJECT_PATH}}",
  },
  {
    type: "内网 IP",
    severity: "warn",
    re: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b/g,
    placeholder: "{{INTERNAL_IP}}",
  },
  {
    type: "疑似学号",
    severity: "warn",
    re: /\b(?:学号|student\s*id)\s*[=:：]?\s*[A-Za-z0-9]{6,20}\b/gi,
    placeholder: "{{STUDENT_ID}}",
  },
  {
    type: "测试账号口令",
    severity: "warn",
    re: /\b(test(user|pass|account)|admin123|password123|qwerty)\b/gi,
    placeholder: "{{TEST_CREDENTIAL}}",
  },
];

function redact(value: string): string {
  if (value.length <= 8) return "***";
  return `${value.slice(0, 3)}…${value.slice(-2)} (len=${value.length})`;
}

export function scanSensitiveText(text: string): SecretFinding[] {
  const lines = text.split(/\r?\n/);
  const findings: SecretFinding[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = rule.re.exec(line)) !== null) {
        findings.push({
          type: rule.type,
          severity: rule.severity,
          line: i + 1,
          hint: redact(m[0]),
          placeholder: rule.placeholder,
        });
      }
    }
  }

  return findings;
}

export function hasBlockingSecrets(findings: SecretFinding[]): boolean {
  return findings.some((f) => f.severity === "block");
}

export function applyPlaceholders(text: string, _findings?: SecretFinding[]): string {
  let out = text;
  for (const rule of RULES) {
    out = out.replace(rule.re, rule.placeholder);
  }
  return out;
}

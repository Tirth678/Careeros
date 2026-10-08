import { spawn } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const WATCH = process.argv.includes("--watch");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const ENTRY = (path: string) => ["run", ...(WATCH ? ["--watch"] : []), path];


const SERVICES = [
  { name: "gateway", path: "apps/gateway/src/index.ts", color: "\x1b[35m" },
  { name: "profile", path: "apps/profile-service/src/index.ts", color: "\x1b[36m" },
  { name: "career", path: "apps/career-service/src/index.ts", color: "\x1b[32m" },
  { name: "ai", path: "apps/ai-service/src/index.ts", color: "\x1b[33m" },
] as const;

const RESET = "\x1b[0m";
const children: any[] = [];

let shuttingDown = false;

function pump(stream: NodeJS.ReadableStream, prefix: string) {
  const decoder = new TextDecoder();
  let buffer = "";
  (stream as any).on("data", (chunk: Buffer) => {
    buffer += decoder.decode(chunk, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      console.log(`${prefix}${buffer.slice(0, newline)}${RESET}`);
      buffer = buffer.slice(newline + 1);
    }
  });
  (stream as any).on("end", () => {
    if (buffer.length > 0) console.log(`${prefix}${buffer}${RESET}`);
  });
}

for (const service of SERVICES) {
  const prefix = `${service.color}[${service.name}]${RESET} `;
  const child = spawn(process.execPath, ['--import', 'tsx', ...(WATCH ? ['--watch'] : []), service.path], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });

  children.push(child);
  child.on('error', (error) => { console.error(error); stopAll(); process.exitCode = 1; });

  if (child.stdout) pump(child.stdout, prefix);
  if (child.stderr) pump(child.stderr, prefix);


  void child.on("exit", (code) => {
    if (shuttingDown) return;
    console.error(`${prefix}exited with code ${code}${RESET}`);
    stopAll();
    process.exitCode = code ?? 1;
  });

}

function stopAll() {
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null && child.pid) child.kill();
  }
}

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});
process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});

console.log(`starting ${SERVICES.length} services${WATCH ? " (watch)" : ""}…`);

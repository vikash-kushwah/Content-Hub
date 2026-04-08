import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];
const SESSION_SECRET = process.env["SESSION_SECRET"] ?? "devdocs-secret";

function signToken(payload: string): string {
  const data = `${payload}:${SESSION_SECRET}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Buffer.from(`${payload}:${Math.abs(hash).toString(36)}`).toString("base64url");
}

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length < 2) return false;
    const payload = parts.slice(0, -1).join(":");
    const expected = signToken(payload);
    return expected === token;
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"] as string | undefined;
  const xToken = req.headers["x-admin-token"] as string | undefined;

  let token: string | undefined;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else if (xToken) {
    token = xToken;
  }

  if (!token || !verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", (req, res): void => {
  if (!ADMIN_PASSWORD) {
    res.status(503).json({ error: "Admin password not configured" });
    return;
  }

  const { password } = req.body as { password?: string };
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = signToken(`admin:${Date.now()}`);
  res.json({ token });
});

router.post("/admin/verify", (req, res): void => {
  const { token } = req.body as { token?: string };
  if (!token || !verifyToken(token)) {
    res.status(401).json({ valid: false });
    return;
  }
  res.json({ valid: true });
});

export default router;

import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "users.json");

// In production this should come from an environment variable, never hardcoded.
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

async function loadUsers() {
  const raw = await fs.readFile(USERS_FILE, "utf-8");
  return JSON.parse(raw);
}

// Simple auth middleware for protected routes.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const users = await loadUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === String(username).toLowerCase()
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: user.username, displayName: user.displayName || user.username },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, displayName: user.displayName || user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ username: req.user.username, displayName: req.user.displayName });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
});

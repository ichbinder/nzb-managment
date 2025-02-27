import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "../db";
import authenticateToken from "../middleware/auth";

const router = Router();

// Login-Route: Vergleich des angegebenen Passworts mit dem gehashten Passwort in der DB
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username und Passwort erforderlich." });
  }
  try {
    const db = client.db("media_cms");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten." });
    }
    // Passwortvergleich mit bcrypt
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten." });
    }
    const token = jwt.sign(
      { username, role: user.role },
      process.env.TOKEN_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Fehler bei der Authentifizierung:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

// Registrierungs-Route: Nur Admins können Benutzer registrieren
router.post("/register", authenticateToken, async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username und Passwort sind erforderlich." });
  }
  // Überprüfe, ob der anfragende Benutzer Admin ist (Token-Payload in req.user)
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Nur Admins können Benutzer registrieren." });
  }
  const currentUser: DecodedToken = req.user!; // Non-null assertion
  try {
    const db = client.db("media_cms");
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Benutzer existiert bereits." });
    }
    // Passwort salzen und hashen
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      username,
      password: hashedPassword,
      role: role || "user",
    };
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Benutzer erfolgreich registriert." });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

// Endpunkt zum Ändern des Benutzerpassworts
router.patch("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Aktuelles und neues Passwort erforderlich." });
  }
  if (!req.user) {
    return res
      .status(403)
      .json({ message: "Kein authentifizierter Benutzer." });
  }
  const currentUser: DecodedToken = req.user!; // Non-null assertion
  try {
    const db = client.db("media_cms");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({
      username: currentUser.username,
    });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }
    // Überprüfe das aktuelle Passwort
    const validPass = await bcrypt.compare(currentPassword, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Aktuelles Passwort falsch." });
    }
    // Salze und hashe das neue Passwort
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Aktualisiere das Passwort in der Datenbank
    await usersCollection.updateOne(
      { username: currentUser.username },
      { $set: { password: hashedPassword } }
    );
    res.json({ message: "Passwort erfolgreich geändert." });
  } catch (error) {
    console.error("Fehler beim Ändern des Passworts:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

export default router;

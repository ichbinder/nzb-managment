import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const mongoUri = process.env.MONGODB_URI || "";
  const tlsCAFile = process.env.TLS_CA_FILE as string;
  const tlsClientFile = process.env.TLS_CLIENT_FILE as string;
  const adminDefaultPassword = process.env.ADMIN_DEFAULT_PASSWORD as string;

  const client = new MongoClient(mongoUri, {
    tls: true,
    tlsCAFile,
    tlsCertificateKeyFile: tlsClientFile,
  } as any);

  try {
    await client.connect();
    console.log("Erfolgreich mit MongoDB verbunden.");

    const db = client.db("media_cms");
    const usersCollection = db.collection("users");

    // Prüfen, ob der Benutzer bereits existiert
    const existingUser = await usersCollection.findOne({ username: "jakob" });
    if (existingUser) {
      console.log("Der Benutzer 'jakob' existiert bereits!");
      return;
    }

    // Definiere das Passwort (ersetze 'sicheresPasswort' durch ein sicheres Passwort)
    const plainPassword = adminDefaultPassword;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Erstelle den neuen Admin Benutzer
    const newUser = {
      username: "jakob",
      password: hashedPassword,
      role: "admin",
    };

    await usersCollection.insertOne(newUser);
    console.log("Admin Benutzer 'jakob' wurde erfolgreich erstellt.");
  } catch (error) {
    console.error("Fehler beim Erstellen des Admin Benutzers:", error);
  } finally {
    await client.close();
  }
})();

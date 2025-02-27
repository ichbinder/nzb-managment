import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || "";
const tlsCAFile = process.env.TLS_CA_FILE as string;
const tlsClientFile = process.env.TLS_CLIENT_FILE as string;

export const client = new MongoClient(mongoUri, {
  tls: true,
  tlsCAFile: tlsCAFile,
  tlsCertificateKeyFile: tlsClientFile,
} as any);

client
  .connect()
  .then(() => console.log("Erfolgreich mit MongoDB verbunden"))
  .catch((err) => console.error("Fehler beim Verbinden mit MongoDB:", err));

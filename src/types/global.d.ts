// Erweiterung des Express Request-Interfaces global
declare namespace Express {
  export interface Request {
    user?: DecodedToken;
  }
}

// Globale Deklaration des Typs, den wir vom Token erwarten.
interface DecodedToken {
  username: string;
  role: string;
  // weitere Felder, z.B. iat, exp, etc.
}

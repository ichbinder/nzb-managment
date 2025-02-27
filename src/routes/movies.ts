import { Router } from "express";
import { client } from "../db";
import { Movie } from "../types/movie";

const router = Router();

router.get("/:tmdbID", async (req, res) => {
  const { tmdbID } = req.params;

  const numericTmdbID = parseInt(tmdbID, 10);
  if (isNaN(numericTmdbID)) {
    return res
      .status(400)
      .json({ message: "Ungültige tmdbID. Es wird eine Zahl erwartet." });
  }

  try {
    const db = client.db("media_cms");
    const moviesCollection = db.collection("movies");
    const movie = await moviesCollection.findOne(
      { tmdbID: numericTmdbID },
      { projection: { nzbFile: 0 } }
    );
    if (!movie) {
      return res.status(404).json({ message: "Film nicht gefunden." });
    }
    const result = {
      title: movie.title,
      tmdbID: movie.tmdbID,
      imdbID: movie.imdbID,
      versions: movie.versions.map((v: any) => ({
        resolution: v.resolution,
        hash: v.hash,
      })),
    };
    res.json(result);
  } catch (error) {
    console.error("Fehler beim Suchen des Films:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

router.get("/version/:hash", async (req, res) => {
  const { hash } = req.params;
  try {
    const db = client.db("media_cms");
    const moviesCollection = db.collection("movies");
    // Suche nach einem Dokument, das ein Version-Element mit dem gesuchten Hash enthält,
    // und projektiere nur das passende Element.
    const movie = await moviesCollection.findOne(
      { "versions.hash": hash },
      { projection: { versions: { $elemMatch: { hash: hash } } } }
    );
    if (!movie || !movie.versions || movie.versions.length === 0) {
      return res.status(404).json({ message: "nzbFile nicht gefunden." });
    }
    // Angenommen, der nzbFile ist im gefundenen Version-Element enthalten
    const version = movie.versions[0];
    if (!version.nzbFile) {
      return res.status(404).json({ message: "nzbFile nicht gefunden." });
    }
    res.json({ nzbFile: version.nzbFile });
  } catch (error) {
    console.error("Fehler beim Suchen der nzbFile:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
});

export default router;

import express from "express";
const router = express.Router();
import db from "#db/client"; // or "#db/client.js" if aliases are set

// GET /playlists
router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM playlists");
  res.send(rows);
});

// POST /playlists
router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is required.");
  }
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .send("Request body must include name and description.");
  }

  const result = await db.query(
    "INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );

  res.status(201).send(result.rows[0]);
});

// GET /playlists/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid playlist ID");

    const result = await db.query("SELECT * FROM playlists WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).send("Playlist not found");

    res.send(result.rows[0]);
  } catch (err) {
    next(err); // Pass error to your error middleware
  }
});

// GET /playlists/:id/tracks
router.get("/:id/tracks", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("Invalid playlist ID");

  const playlistCheck = await db.query(
    "SELECT * FROM playlists WHERE id = $1",
    [id]
  );
  if (playlistCheck.rows.length === 0)
    return res.status(404).send("Playlist not found");

  const query = `
    SELECT tracks.*
    FROM playlists_tracks
    JOIN tracks ON playlists_tracks.track_id = tracks.id
    WHERE playlists_tracks.playlist_id = $1
  `;

  const { rows } = await db.query(query, [id]);
  res.send(rows);
});

// POST /playlists/:id/tracks
router.post("/:id/tracks", async (req, res) => {
  const playlistId = parseInt(req.params.id);
  if (!req.body) {
    return res.status(400).send("Request body is required.");
  }
  const { trackId } = req.body;

  if (isNaN(playlistId)) return res.status(400).send("Invalid playlist ID");
  if (!trackId || isNaN(parseInt(trackId))) {
    return res.status(400).send("trackId must be a valid number");
  }

  // Check if playlist exists
  const playlist = await db.query("SELECT * FROM playlists WHERE id = $1", [
    playlistId,
  ]);
  if (playlist.rows.length === 0)
    return res.status(404).send("Playlist not found");

  // Check if track exists
  const track = await db.query("SELECT * FROM tracks WHERE id = $1", [trackId]);
  if (track.rows.length === 0) return res.status(400).send("Track not found");

  try {
    const result = await db.query(
      "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2) RETURNING *",
      [playlistId, trackId]
    );
    res.status(201).send(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).send("Track already in playlist.");
    }
    throw err; // Let app-level error handler catch it
  }
});

export default router;

import express from "express";
const app = express();
import playlistsRouter from "#api/playlists";
import tracksRouter from "#api/tracks";

// Middleware
app.use(express.json());

// Routes
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

// Error handling:
// invalid input type 22P02:
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send("Invalid input type.");
  }
  // foreign key violation 23503:
  if (err.code === "23503") {
    return res.status(400).send("Referenced record not found.");
  }

  //unique violation 23505:
  if (err.code === "23505") {
    return res.status(400).send("Track already in playlist.");
  }

  console.error(err);
  res.status(500).send("Server error.");
});

// default export — the app
export default app;

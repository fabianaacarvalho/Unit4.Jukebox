import express from "express";
const router = express.Router();
import db from "#db/client";

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM tracks");
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("Invalid track ID");

  const { rows } = await db.query("SELECT * FROM tracks WHERE id = $1", [id]);
  if (rows.length === 0) return res.status(404).send("Track not found");

  res.send(rows[0]);
});

export default router;

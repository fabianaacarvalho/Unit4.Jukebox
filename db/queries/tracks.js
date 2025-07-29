import db from "#db/client";

export async function createTrack(name) {
  const sql = `
  INSERT INTO tracks
    (name)
  VALUES
    ($1)
  RETURNING *
  `;
  const {
    rows: [track],
  } = await db.query(sql, [name]);
  return track;
}

export async function getTracks() {
  const sql = `
  SELECT *
  FROM tracks
  `;
  const { rows: tracks } = await db.query(sql);
  return tracks;
}

export async function getTrackById(id) {
  const sql = `
  SELECT *
  FROM tracks
  WHERE id = $1
  `;
  const {
    rows: [track],
  } = await db.query(sql, [id]);
  return track;
}

export async function getTracksByPlaylistId(id) {
  const sql = `
  SELECT DISTINCT tracks.*
  FROM
    playlists_tracks
    JOIN playlists ON playlists_tracks.playlist_id = playlists.id
    JOIN tracks ON playlists_tracks.track_id = tracks.id
  WHERE
    playlists.id = $1
  `;
  const { rows: tracks } = await db.query(sql, [id]);
  return tracks;
}

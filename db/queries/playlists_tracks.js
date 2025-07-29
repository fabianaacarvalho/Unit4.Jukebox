import db from "#db/client";

export async function createPlaylists_track(trackId, playlistId) {
  const sql = `
  INSERT INTO playlists_tracks
    (track_id, playlist_id)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [playlists_track],
  } = await db.query(sql, [trackId, playlistId]);
  return playlists_track;
}

export async function getPlaylists_tracks() {
  const sql = `
  SELECT playlists_tracks.*,
    tracks.name AS track_name,
    playlists.name AS playlist_name
  FROM playlists_tracks
    JOIN playlists ON playlists_tracks.playlist_id = playlists.id
    JOIN tracks ON playlists_tracks.track_id = tracks.id
  `;
  const { rows: playlists_tracks } = await db.query(sql);
  return playlists_tracks;
}

export async function getPlaylists_tracksByTrackId(id) {
  const sql = `
  SELECT *
  FROM playlists_tracks
  WHERE track_id = $1
  `;
  const { rows: playlists_tracks } = await db.query(sql, [id]);
  return playlists_tracks;
}

export async function getPlaylists_tracksByPlaylistId(id) {
  const sql = `
  SELECT *
  FROM playlists_tracks
  WHERE playlist_id = $1
  `;
  const { rows: playlists_tracks } = await db.query(sql, [id]);
  return playlists_tracks;
}

// import db from "#db/client";

// import { createTrack } from "#db/queries/tracks";
// import { createPlaylist } from "#db/queries/playlists";
// import { createPlaylists_track } from "#db/queries/playlists_tracks";

// await db.connect();
// await seed();
// await db.end();
// console.log("🌱 Database seeded.");

// async function seed() {
//   // TODO
//   for (let i = 1; i <= 20; i++) {
//     const durationMs = Math.floor(Math.random() * (300 - 120 + 1) + 120);
//     await createTrack("Name " + i, durationMs);
//   }

//   for (let i = 1; i <= 10; i++) {
//     await createPlaylist("Playlist " + i, "Description " + i);
//   }

//   for (let i = 1; i <= 15; i++) {
//     const trackId = 1 + Math.floor(Math.random() * 20);
//     const playlistId = 1 + Math.floor(Math.random() * 10);
//     await createPlaylists_track(trackId, playlistId);
//   }
// }

import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO: create the tracks
  for (let i = 1; i <= 20; i++) {
    // loop(iterator variable, stop cond = 20, iteration statement++)
    //It inserts 20 tracks into the tracks w name
    await db.query(
      `INSERT INTO tracks (name, duration_ms) VALUES ($1, $2)`,
      [`Track ${i}`, 180000] // 1000 ms = 1 sec, 180000 = 3 minutes
    );
  }

  // Create playlists
  for (let i = 1; i <= 10; i++) {
    await db.query(
      `INSERT INTO playlists (name, description) VALUES ($1, $2)`,
      [`Playlist ${i}`, `Description for playlist ${i}`]
    );
  }

  // Associate tracks with playlists
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(Math.random() * 10);
    const trackId = 1 + Math.floor(Math.random() * 20);

    try {
      await db.query(
        `INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2)`,
        [playlistId, trackId]
      );
    } catch (err) {
      // Ignore unique constraint errors to avoid duplicates
      if (err.code !== "23505") throw err;
    }
  }
}

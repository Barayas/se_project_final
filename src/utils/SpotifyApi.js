const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export function setAccessToken(token, expiresIn = 3600) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem("spotify_access_token", token);
  localStorage.setItem("spotify_token_expiration", expirationTime);
}

export function setRefreshToken(refreshToken) {
  localStorage.setItem("spotify_refresh_token", refreshToken);
}

export function clearAccessToken() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_token_expiration");
  localStorage.removeItem("spotify_refresh_token");
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    console.warn("No refresh token found. User must log in again.");
    return null;
  }

  try {
    const res = await fetch(
      `http://localhost:3001/refresh_token?refresh_token=${refreshToken}`
    );
    const data = await res.json();

    if (data.access_token) {
      const expiresIn = data.expires_in || 3600;
      setAccessToken(data.access_token, expiresIn);
      return data.access_token;
    } else {
      console.error("Failed to refresh token:", data);
      return null;
    }
  } catch (err) {
    console.error("Error refreshing Spotify token:", err);
    return null;
  }
}

export async function getAccessToken() {
  let token = localStorage.getItem("spotify_access_token");
  const expiration = localStorage.getItem("spotify_token_expiration");

  if (!token || Date.now() > Number(expiration)) {
    token = await refreshAccessToken();
  }

  return token;
}

export async function spotifyFetch(endpoint, options = {}) {
  let token = await getAccessToken();
  if (!token) throw new Error("No Spotify access token available");

  let res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) throw new Error("Unable to refresh Spotify token");
    res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  }

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Spotify API Error:", res.status, errorBody);
    throw new Error(`Spotify API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function getCurrentUserProfile() {
  return spotifyFetch("/me");
}

export async function getUserPlaylists(limit = 20) {
  return spotifyFetch(`/me/playlists?limit=${limit}`);
}

export async function createPlaylist(
  userId,
  name,
  description = "",
  isPublic = false
) {
  const body = { name, description, public: isPublic };
  return spotifyFetch(`/users/${userId}/playlists`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function addTracksToPlaylist(playlistId, uris) {
  return spotifyFetch(`/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: JSON.stringify({ uris }),
  });
}

export async function removeTracksFromPlaylist(playlistId, uris) {
  return spotifyFetch(`/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    body: JSON.stringify({ tracks: uris.map((uri) => ({ uri })) }),
  });
}

export async function getNewReleases(limit = 20) {
  const releasesData = await spotifyFetch(
    `/browse/new-releases?limit=${limit}`
  );
  const albums = releasesData.albums.items;

  const albumsWithGenres = await Promise.all(
    albums.map(async (album) => {
      let genre = "Unknown";
      try {
        const artistId = album.artists?.[0]?.id;
        if (artistId) {
          const artistData = await spotifyFetch(`/artists/${artistId}`);
          if (artistData.genres?.length > 0) {
            genre = artistData.genres[0]; // take the first genre
          }
        }
      } catch (err) {
        console.error(
          `Failed to fetch genres for artist ${album.artists?.[0]?.name}:`,
          err
        );
      }

      let tracks = [];
      try {
        const tracksData = await spotifyFetch(`/albums/${album.id}/tracks`);
        tracks = tracksData.items.map((t) => ({
          name: t.name,
          duration_ms: t.duration_ms,
        }));
      } catch (err) {
        console.error(`Failed to fetch tracks for album ${album.id}:`, err);
      }

      return {
        id: album.id,
        title: album.name,
        artist: album.artists.map((a) => a.name).join(", "),
        cover: album.images?.[0]?.url || "",
        genre,
        tracks,
      };
    })
  );

  return albumsWithGenres;
}

export async function searchSpotify(query, type = "track", limit = 10) {
  const encodedQuery = encodeURIComponent(query);
  return spotifyFetch(`/search?q=${encodedQuery}&type=${type}&limit=${limit}`);
}

export async function getArtistGenres(artistIds = []) {
  if (!artistIds.length) return {};
  const batchedIds = artistIds.slice(0, 50).join(",");
  const data = await spotifyFetch(`/artists?ids=${batchedIds}`);
  const genreMap = {};
  data.artists.forEach((artist) => {
    genreMap[artist.id] = artist.genres;
  });
  return genreMap;
}

export async function getAlbumTracks(albumId) {
  const data = await spotifyFetch(`/albums/${albumId}/tracks`);
  return data.items.map((t) => ({
    id: t.id,
    name: t.name,
    preview_url: t.preview_url,
    duration_ms: t.duration_ms,
  }));
}

export async function getPlaylistTracks(playlistId) {
  const data = await spotifyFetch(`/playlists/${playlistId}/tracks?limit=100`);
  return data.items.map((item) => {
    const t = item.track;
    return {
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      album: t.album?.name,
      uri: t.uri,
    };
  });
}

export async function deleteTrackFromPlaylist(playlistId, trackUri) {
  return spotifyFetch(`/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    body: JSON.stringify({ tracks: [{ uri: trackUri }] }),
  });
}

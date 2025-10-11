const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export function setAccessToken(token, expiresIn = 3600) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem("spotify_access_token", token);
  localStorage.setItem("spotify_token_expiration", expirationTime);
}

export function setRefreshToken(refreshToken) {
  localStorage.setItem("spotify_refresh_token", refreshToken);
}

export function getAccessToken() {
  const token = localStorage.getItem("spotify_access_token");
  const expiration = localStorage.getItem("spotify_token_expiration");
  if (!token || Date.now() > expiration) return null;
  return token;
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    console.error("No refresh token found");
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    const res = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(
            `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
              import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
            }`
          ),
      },
      body: params,
    });

    if (!res.ok) throw new Error("Failed to refresh access token");
    const data = await res.json();

    if (data.access_token) {
      setAccessToken(data.access_token, data.expires_in);
      return data.access_token;
    }
  } catch (err) {
    console.error("Error refreshing Spotify token:", err);
    return null;
  }
}

export async function spotifyFetch(endpoint, options = {}) {
  let token = getAccessToken();
  if (!token) {
    token = await refreshAccessToken();
    if (!token) throw new Error("No Spotify access token available");
  }

  const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) throw new Error("Unable to refresh token");
    return spotifyFetch(endpoint, options);
  }

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Spotify API Error:", res.status, errorBody);
    throw new Error(`Spotify API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export function clearAccessToken() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_token_expiration");
  localStorage.removeItem("spotify_refresh_token");
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

  const albumsWithTracks = await Promise.all(
    albums.map(async (album) => {
      try {
        const tracksData = await spotifyFetch(`/albums/${album.id}/tracks`);
        const tracks = tracksData.items.map((t) => ({
          name: t.name,
          duration_ms: t.duration_ms,
        }));

        return {
          id: album.id,
          title: album.name,
          artist: album.artists.map((a) => a.name).join(", "),
          cover: album.images?.[0]?.url || "",
          genre: album.album_type || "Unknown",
          tracks,
        };
      } catch (err) {
        console.error(`Failed to fetch tracks for album ${album.id}:`, err);
        return {
          id: album.id,
          title: album.name,
          artist: album.artists.map((a) => a.name).join(", "),
          cover: album.images?.[0]?.url || "",
          genre: album.album_type || "Unknown",
          tracks: [],
        };
      }
    })
  );

  return albumsWithTracks;
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

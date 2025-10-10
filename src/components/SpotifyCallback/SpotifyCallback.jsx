import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        console.error("No authorization code found in callback URL");
        return;
      }

      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_REDIRECT_URI;
      const codeVerifier = localStorage.getItem("code_verifier");

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      });

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem("spotify_access_token", data.access_token);
          console.log("Spotify Access Token:", data.access_token);
          navigate("/"); // redirect to home or playlists
        } else {
          console.error("Failed to get access token:", data);
        }
      } catch (error) {
        console.error("Error fetching Spotify token:", error);
      }
    };

    fetchAccessToken();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2>Connecting to Spotify...</h2>
      <p>Please wait a moment while we complete the login.</p>
    </div>
  );
}

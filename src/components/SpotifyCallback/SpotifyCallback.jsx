import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setAccessToken,
  setRefreshToken,
  getCurrentUserProfile,
} from "../../utils/SpotifyApi";

export default function SpotifyCallback({ setSpotifyUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");
    const refresh = hashParams.get("refresh_token");
    const expiresIn = parseInt(hashParams.get("expires_in") || "3600", 10);

    if (!token) {
      console.error("No access token found in URL hash");
      return;
    }

    setAccessToken(token, expiresIn);
    if (refresh) setRefreshToken(refresh);

    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        setSpotifyUser(profile);
        localStorage.setItem("spotify_user", JSON.stringify(profile));
        window.location.hash = "";
        navigate("/");
      } catch (err) {
        console.error("Failed to fetch Spotify profile", err);
      }
    };

    fetchProfile();
  }, [navigate, setSpotifyUser]);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h2>Connecting to Spotify...</h2>
      <p>Please wait while we complete the login.</p>
    </div>
  );
}

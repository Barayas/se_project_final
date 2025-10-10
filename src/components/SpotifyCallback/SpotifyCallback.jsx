import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken, getCurrentUserProfile } from "../../utils/SpotifyApi";

export default function SpotifyCallback({ setSpotifyUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SpotifyCallback useEffect triggered");
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");
    const expiresIn = parseInt(hashParams.get("expires_in") || "3600", 10);

    if (!token) {
      console.error("No access token found in URL hash");
      return;
    }

    // Store token locally
    setAccessToken(token, expiresIn);

    // Fetch Spotify profile and update App state
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        setSpotifyUser(profile);
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

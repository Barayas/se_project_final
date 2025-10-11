import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
            >
              About
            </NavLink>
          </li>

          <li>
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar__link"
            >
              Spotify
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

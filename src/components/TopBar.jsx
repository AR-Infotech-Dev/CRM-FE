import {
  Bell,
  ChevronDown,
  Command,
  PanelTop,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import Spinner from "./ui/Spinner";
import { APP_NAME } from "../api/config";
import NotificationBell from "./ui/NotificationBell";
function TopBar({ onLogout }) {
  const [isLoggingOut, setLoggingOut] = useState(false)
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setLoggingOut(true);

    // small delay for loader effect
    setTimeout(async () => {
      await onLogout?.();
      setLoggingOut(false);
    }, 1200);
  };
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="workspace-mark">
          {/* <div className="workspace-mark-icon">
            <PanelTop size={16} />
          </div> */}
          <div className="workspace-copy">
            {/* <span className="workspace-label">Workspace</span> */}
            <h1>{APP_NAME}</h1>
          </div>
        </div>
        {/* <span className="topbar-chip">
          <Sparkles size={14} />
          New Data
        </span> */}
      </div>

      <div className="topbar-center">
        <div className="search-box">
          <Search size={16} />
          <input type="text" value="Search" readOnly />
          <span className="search-shortcut">
            <Command size={12} />
            K
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {/* <button classNa me="top-link accent">Share</button> */}
        <button className="top-link flex gap-2"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut && <Spinner classNames={"mx-4"} />} 
          Logout
        </button>
        <NotificationBell/>
        <button className="topbar-profile">
          <span className="topbar-profile-ring">WS</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;

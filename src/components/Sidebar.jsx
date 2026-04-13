import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeRequest } from "../api/httpClient";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FileText,
  Gauge,
  KeyRound,
  LayoutGrid,
  Mail,
  MenuSquare,
  NotepadText,
  Sparkles,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";

// ✅ ICON MAP (IMPORTANT)
const iconMap = {
  Users,
  ShieldCheck,
  MenuSquare,
  BriefcaseBusiness,
  Building2,
  FileText,
  Gauge,
  KeyRound,
  LayoutGrid,
  Mail,
  NotepadText,
  Sparkles,
  Workflow,
};

// ✅ BUILD SIDEBAR FROM API
const buildSidebar = (menus) => {
  const parents = menus.filter((m) => m.isParent === "yes");
  const children = menus.filter((m) => m.isParent === "no");

  return parents.map((parent) => ({
    title: parent.menuName,
    items: children
      .filter((child) => child.parentID === parent.menuID)
      .map((child) => ({
        label: child.menuName,
        moduleId: child.menuLink,
        icon: iconMap[child.iconName] || Users, // ✅ FIXED
      })),
  }));
};

function Sidebar({ activeModule = "", onSelectModule }) {
  const [sidebarGroups, setSidebarGroups] = useState([]);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (title) => {
    if (!title) return;

    setCollapsedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const getMenuList = async () => {
      try {
        const res = await makeRequest("/menus", {
          method: "post",
          body: JSON.stringify({ getAll: "Y" }),
        });

        if (res?.data) {
          const groups = buildSidebar(res.data);
          setSidebarGroups(groups); // ✅ Correct state update
        }
      } catch (err) {
        console.error("Sidebar Error:", err);
      }
    };

    getMenuList();

  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-sections">
        {console.log(sidebarGroups)}
        {sidebarGroups.map((group) => (
          <section key={group.title} className="sidebar-group">
            {/* GROUP HEADER */}
            <button
              type="button"
              className="sidebar-group-title sidebar-group-toggle"
              onClick={() => toggleGroup(group.title)}
            >
              <span>{group.title}</span>
              <ChevronDown
                size={14}
                className={collapsedGroups[group.title] ? "is-collapsed" : ""}
              />
            </button>

            {/* GROUP ITEMS */}
            <div
              className={`sidebar-group-items ${collapsedGroups[group.title] ? "collapsed" : ""
                }`}
            >
              {group.items.map((item) => {
                const Icon = item.icon;

                const isActive = item.moduleId === activeModule;

                return (
                  <Link key={item.menuID} className="no-underline" to={item.moduleId}>
                    <button
                      key={item.label}
                      className={`sidebar-item w-full ${isActive ? "active" : ""}`}
                      onClick={() =>
                        item.moduleId && onSelectModule?.(item.moduleId)
                      }
                    >
                      <span className="sidebar-icon">
                        <Icon size={16} />
                      </span>
                      <span className="no-underline">
                        {item.label}
                      </span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sync-card">
        <div className="sync-ring" />
        <div>
          <div className="sync-title">Syncing hello@brixui.c...</div>
          <div className="sync-subtitle">6060 emails processed</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
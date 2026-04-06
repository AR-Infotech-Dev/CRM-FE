import { useState } from "react";
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

const sidebarGroups = [
  {
    title: "",
    items: [
      { icon: Gauge, label: "Dashboard" },
      { icon: FileText, label: "Tasks" },
      { icon: NotepadText, label: "Notes", count: 10 },
      { icon: Mail, label: "Emails" },
      { icon: LayoutGrid, label: "Reports", active: true },
      { icon: Workflow, label: "Automations" },
    ],
  },
  {
    title: "Settings",
    items: [
      // { icon: BriefcaseBusiness, label: "Companies" },
      // { icon: Users, label: "People" },
      // { icon: Building2, label: "Deals", tint: "pink" },
      // { icon: Building2, label: "Workspace", tint: "green" },
      { icon: Users, label: "Users", tint: "amber", moduleId: "users" },
      { icon: ShieldCheck, label: "User Role Master", tint: "green", moduleId: "userRoleMaster" },
      { icon: ShieldCheck, label: "Access Control", tint: "pink", moduleId: "accessControl" },
      { icon: MenuSquare, label: "Menu Master", tint: "pink", moduleId: "menuMaster" },
      // { icon: KeyRound, label: "Login", tint: "amber", moduleId: "login" },
    ],
  },
  // {
  //   title: "Pinned Views",
  //   items: [
  //     { icon: Sparkles, label: "Sales", activeSoft: true },
  //     { icon: Sparkles, label: "Sourcing" },
  //     { icon: Sparkles, label: "Hiring" },
  //     { icon: Sparkles, label: "Partnerships" },
  //     { icon: Sparkles, label: "Social Champions" },
  //   ],
  // },
];

function Sidebar({ activeModule = "users", onSelectModule }) {
  const [collapsedGroups, setCollapsedGroups] = useState({
    Objects: false,
    "Pinned Views": false,
  });

  const toggleGroup = (title) => {
    if (!title) {
      return;
    }

    setCollapsedGroups((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  return (
    <aside className="sidebar">
      {/* <button className="add-new-card">
        <Plus size={16} />
        <span>Add New</span>
      </button> */}

      <div className="sidebar-sections">
        {sidebarGroups.map((group) => (
          <section key={group.title || "main"} className="sidebar-group">
            {group.title ? (
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
            ) : null}

            <div
              className={`sidebar-group-items ${
                collapsedGroups[group.title] ? "collapsed" : ""
              }`}
            >
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.moduleId
                  ? activeModule === item.moduleId
                  : item.active;

                return (
                  <button
                    key={item.label}
                    className={`sidebar-item ${isActive ? "active" : ""} ${
                      item.activeSoft ? "active-soft" : ""
                    }`}
                    onClick={() => item.moduleId && onSelectModule?.(item.moduleId)}
                  >
                    <span className={`sidebar-icon ${item.tint || ""}`}>
                      <Icon size={16} />
                    </span>
                    <span>{item.label}</span>
                    {item.count ? <span className="item-count">{item.count}</span> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

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

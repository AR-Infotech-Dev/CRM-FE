// import { useEffect, useMemo, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { makeRequest } from "../api/httpClient";
// import { BriefcaseBusiness, Building2, ChevronDown, FileText, Gauge, KeyRound, LayoutGrid, Mail, MenuSquare, NotepadText, Sparkles, ShieldCheck, Users, Workflow, Folder, } from "lucide-react";

// const iconMap = { Users, ShieldCheck, MenuSquare, BriefcaseBusiness, Building2, FileText, Gauge, KeyRound, LayoutGrid, Mail, NotepadText, Sparkles, Workflow, };
// const getIcon = (iconName) => iconMap[iconName] || Folder;
// const buildSidebar = (menus = []) => {
//   return menus.map((parent) => ({
//     id: parent.menuID,
//     title: parent.menuName,
//     icon: getIcon(parent.iconName),
//     moduleId: parent.menuLink,
//     items: (parent.subMenu || []).map((child) => ({
//       id: child.menuID,
//       label: child.menuName,
//       moduleId: child.menuLink,
//       icon: getIcon(child.iconName),
//     })),
//   }));
// };

// function Sidebar({ activeModule = "", onSelectModule }) {
//   const [sidebarGroups, setSidebarGroups] = useState([]);
//   const [collapsedGroups, setCollapsedGroups] = useState({});
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchMenus = async () => {
//   //     try {
//   //       setLoading(true);

//   //       const res = await makeRequest("/menus/getMenuList", {
//   //         method: "GET",
//   //       });

//   //       const menuData = res?.data || [];

//   //       const groups = buildSidebar(menuData);

//   //       setSidebarGroups(groups);

//   //       const defaultOpen = {};
//   //       groups.forEach((g) => {
//   //         defaultOpen[g.title] = false;
//   //       });

//   //       setCollapsedGroups(defaultOpen);
//   //     } catch (error) {
//   //       console.log("Sidebar Error:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchMenus();
//   // }, []);

//   // ===============================
//   // TOGGLE GROUP
//   // ===============================
//   const toggleGroup = (title) => {
//     setCollapsedGroups((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   // ===============================
//   // AUTO OPEN ACTIVE GROUP
//   // ===============================
//   useEffect(() => {
//     sidebarGroups.forEach((group) => {
//       const hasActiveChild = group.items.some(
//         (item) => item.moduleId === activeModule
//       );

//       if (hasActiveChild) {
//         setCollapsedGroups((prev) => ({
//           ...prev,
//           [group.title]: false,
//         }));
//       }
//     });
//   }, [activeModule, sidebarGroups]);

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-sections">
//         {loading && (
//           <div className="p-4 text-sm opacity-70">
//             Loading menu...
//           </div>
//         )}

//         {/* ======================= */}
//         {/* MENU GROUPS */}
//         {/* ======================= */}
//         {!loading &&
//           sidebarGroups.map((group) => {
//             const GroupIcon = group.icon;
//             const isCollapsed = collapsedGroups[group.title];

//             const isDirectActive =
//               group.moduleId &&
//               group.items.length === 0 &&
//               group.moduleId === activeModule;

//             return (
//               <section key={group.id} className="sidebar-group">

//                 {/* ======================= */}
//                 {/* GROUP HEADER */}
//                 {/* ======================= */}
//                 <button type="button" className={`sidebar-group-title sidebar-group-toggle ${isDirectActive ? "active" : ""}`}
//                   onClick={() => {
//                     if (group.items.length) {
//                       toggleGroup(group.title);
//                     } else {
//                       onSelectModule?.(group.moduleId);
//                     }
//                   }} >
//                   <span className="flex items-center gap-2">
//                     <GroupIcon size={16} /> {group.title}
//                   </span>

//                   {group.items.length > 0 && (
//                     <ChevronDown size={14} className={isCollapsed ? "rotate-180" : ""} />
//                   )}
//                 </button>

//                 {/* ======================= */}
//                 {/* CHILD ITEMS */}
//                 {/* ======================= */}
//                 {group.items.length > 0 && !isCollapsed && (
//                   <div className="sidebar-group-items">
//                     {group.items.map((item) => {
//                       const Icon = item.icon;
//                       const isActive = item.moduleId === activeModule;
//                       return (
//                         <NavLink
//                           key={item.id}
//                           to={`/${item.moduleId}`}
//                           className="no-underline"
//                           onClick={() => onSelectModule?.(item.moduleId) }
//                         >
//                           <button className={`sidebar-item w-full ${isActive ? "active" : "" }`} >
//                             <span className="sidebar-icon"> {/* <Icon size={15} /> */} </span>
//                             <span>{item.label}</span>
//                           </button>
//                         </NavLink>
//                       );
//                     })}
//                   </div>
//                 )}
//               </section>
//             );
//           })}
//       </div>

//       {/* ======================= */}
//       {/* FOOTER */}
//       {/* ======================= */}
//       <div className="sync-card">
//         <div className="sync-ring" />
//         <div>
//           <div className="sync-title">CRM Connected</div>
//           <div className="sync-subtitle">
//             Dynamic menu loaded from API
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  Gauge,
  Users,
  Ticket,
  LayoutGrid,
  ContactRound,
  ShieldCheck,
  Building2,
  MenuSquare
} from "lucide-react";

// ============================================
// STATIC MENU
// ============================================
const menus = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Gauge,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: ContactRound,
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon: Ticket,
  },
  {
    label: "Category",
    path: "/category",
    icon: LayoutGrid,
  },
  {
    label: "Role Master",
    path: "/user-roles",
    icon: ShieldCheck,
  },
  {
    label: "Company Master",
    path: "/companyMaster",
    icon: Building2,
  },
  {
    label: "Menu Master",
    path: "/menus",
    icon: MenuSquare,
  },
];

// ============================================
// COMPONENT
// ============================================
function Sidebar({ onSelectModule }) {
  return (
    <aside className="sidebar">
      {/* ============================= */}
      {/* MENU */}
      {/* ============================= */}
      <div className="sidebar-sections">
        <section className="sidebar-group">
          <div className="sidebar-group-title px-2">
            Main Menu
          </div>

          <div className="sidebar-group-items">
            {menus.map((item, index) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className="no-underline"
                  onClick={() =>
                    onSelectModule?.(item.path)
                  }
                >
                  {({ isActive }) => (
                    <button
                      className={`sidebar-item w-full ${
                        isActive ? "active" : ""
                      }`}
                    >
                      <span className="sidebar-icon">
                        <Icon size={16} />
                      </span>

                      <span>{item.label}</span>
                    </button>
                  )}
                </NavLink>
              );
            })}
          </div>
        </section>
      </div>

      {/* ============================= */}
      {/* FOOTER */}
      {/* ============================= */}
      <div className="sync-card">
        <div className="sync-ring" />

        <div>
          <div className="sync-title">
            CRM Connected
          </div>

          <div className="sync-subtitle">
            Static Sidebar Menu
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

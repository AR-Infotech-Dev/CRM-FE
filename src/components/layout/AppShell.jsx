function AppShell({ topbar, sidebar, toolbar, children, overlay }) {
  return (
    <div className="app-shell">
      {topbar}
      <div className="app-frame">
        {sidebar}
        <main className="content-area">
          {toolbar}
          {children}
        </main>
        {overlay}
      </div>
    </div>
  );
}

export default AppShell;

import LinearProgress from "../ui/LinearProgress";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppShell({ topbar, sidebar, toolbar, children, overlay }) {
  return (
    <div className="app-shell">
      <LinearProgress />
      {topbar}
      <div className="app-frame">
        {sidebar}
        <main className="content-area">
          <ToastContainer
            position="top-right" // Position of the toast
            autoClose={3000}    // Close after 3s
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"     // light, dark, or colored
          />
          {toolbar}
          {children}
        </main>
        {overlay}
      </div>
    </div>
  );
}

export default AppShell;

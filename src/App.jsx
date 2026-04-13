import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import MainRoutes from "./routes/MainRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

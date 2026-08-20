import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import AppRoutes from "./routes/Routes.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
          success: {
            iconTheme: {
              primary: "#6366f1",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <div className="min-h-screen bg-[#f8f9fc] text-slate-800">
        <Navbar />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;

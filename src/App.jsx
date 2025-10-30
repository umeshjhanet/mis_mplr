import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NewClient from "./pages/Client";
import SiteCompletionForm from "./pages/SiteCompletionForm";
import { AdminRoute, PrivateRoute } from "./Auth/Auth";

function App() {
  return (
    <>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/client" element={<NewClient />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/siteCompletionForm" element={<SiteCompletionForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

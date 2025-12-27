import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CandidateDashboard from "./pages/CandidateDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import RequireAuth from "./auth/RequireAuth";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Candidate */}
        <Route
          path="/candidate"
          element={
            <RequireAuth role="candidate">
              <CandidateDashboard />
            </RequireAuth>
          }
        />

        {/* Company */}
        <Route
          path="/company"
          element={
            <RequireAuth role="company">
              <CompanyDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

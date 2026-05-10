import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import CohortDetail from "./pages/CohortDetail";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patient/:id" element={<PatientDetail />} />
        <Route
          path="/cohort/:cohortName"
          element={<CohortDetail />}
        />
      </Routes>
    </div>
  );
}

export default App;
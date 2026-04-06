import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { TeamPage } from "@/pages/TeamPage";
import { ObjectivePage } from "@/pages/ObjectivePage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="teams/:id" element={<TeamPage />} />
        <Route path="objectives/:id" element={<ObjectivePage />} />
      </Route>
    </Routes>
  );
}

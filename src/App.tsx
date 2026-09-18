import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";

import Home from "./pages/Home";
import Sport from "./pages/Sport";
import GameDetail from "./pages/GameDetail";
import PlayerDetail from "./pages/PlayerDetail";
import Results from "./pages/Results";
import Tools from "./pages/Tools";
import FutureRelease from "./pages/FutureRelease";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nba" element={<Sport sport="nba" />} />
          <Route path="/nhl" element={<Sport sport="nhl" />} />
          <Route path="/mlb" element={<Sport sport="mlb" />} />
          <Route path="/wnba" element={<Sport sport="wnba" />} />
          <Route path="/nfl" element={<Sport sport="nfl" />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/results" element={<Results />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/future" element={<FutureRelease />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

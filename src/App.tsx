import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Sport from "./pages/Sport";
import GameDetail from "./pages/GameDetail";
import PlayerDetail from "./pages/PlayerDetail";
import ArticleList from "./pages/ArticleList";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleNew from "./pages/ArticleNew";
import UserProfile from "./pages/UserProfile";
import Leaderboard from "./pages/Leaderboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Pricing from "./pages/Pricing";
import Subscribe from "./pages/Subscribe";
import Upgrade from "./pages/Upgrade";
import Billing from "./pages/Billing";

import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nba" element={<Sport sport="nba" />} />
          <Route path="/nhl" element={<Sport sport="nhl" />} />
          <Route path="/mlb" element={<Sport sport="mlb" />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Route>

        {/* Auth-only, no subscription required */}
        <Route
          element={
            <ProtectedRoute requireSubscription={false}>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Subscription-gated, public layout */}
        <Route
          element={
            <ProtectedRoute>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/articles/new" element={<ArticleNew />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

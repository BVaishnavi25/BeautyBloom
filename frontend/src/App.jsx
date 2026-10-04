import React from "react";
import { Routes, Route, Navigate, useOutletContext, useNavigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/pages/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppDataProvider } from "@/context/AppDataContext";

import ProfilePage from "@/pages/dashboard/ProfilePage";
import SkincarePage from "@/pages/dashboard/SkincarePage";
import MakeupPage from "@/pages/dashboard/MakeupPage";
import IngredientsPage from "@/pages/dashboard/IngredientsPage";
import AiGuidePage from "@/pages/dashboard/AiGuidePage";
import RoutineTrackerPage from "@/pages/dashboard/RoutineTrackerPage";
import JournalPage from "@/pages/dashboard/JournalPage";
import FavoritesPage from "@/pages/dashboard/FavoritesPage";
import TipsPage from "@/pages/dashboard/TipsPage";
import ProgressPage from "@/pages/dashboard/ProgressPage";

// Small adapters so each dashboard page keeps its original, simple prop signature
// while its actual data comes from AppDataContext via the router's outlet context.
function ProfileRoute() {
  const d = useOutletContext();
  return <ProfilePage profile={d.profile} setProfile={d.setProfile} quizResult={d.quizResult} submitQuiz={d.submitQuiz} historyModules={d.historyModules} />;
}
function SkincareRoute() { const d = useOutletContext(); const nav = useNavigate(); return <SkincarePage profile={d.profile} quizResult={d.quizResult} goToProfile={() => nav("/app/profile", { state: { tab: "quiz" } })} />; }
function MakeupRoute() { const d = useOutletContext(); const nav = useNavigate(); return <MakeupPage profile={d.profile} quizResult={d.quizResult} goToProfile={() => nav("/app/profile", { state: { tab: "quiz" } })} />; }
function IngredientsRoute() { const d = useOutletContext(); const nav = useNavigate(); return <IngredientsPage profile={d.profile} quizResult={d.quizResult} goToProfile={() => nav("/app/profile", { state: { tab: "quiz" } })} />; }
function AiGuideRoute() { const d = useOutletContext(); const nav = useNavigate(); return <AiGuidePage profile={d.profile} quizResult={d.quizResult} goToProfile={() => nav("/app/profile", { state: { tab: "quiz" } })} />; }
function TrackerRoute() { const d = useOutletContext(); return <RoutineTrackerPage routineEntries={d.routineEntries} setRoutineEntries={d.setRoutineEntries} profile={d.profile} quizResult={d.quizResult} />; }
function JournalRoute() { const d = useOutletContext(); return <JournalPage journal={d.journal} setJournal={d.setJournal} />; }
function FavoritesRoute() { const d = useOutletContext(); return <FavoritesPage favorites={d.favorites} />; }
function TipsRoute() { const d = useOutletContext(); return <TipsPage profile={d.profile} quizResult={d.quizResult} />; }
function ProgressRoute() { const d = useOutletContext(); return <ProgressPage routineEntries={d.routineEntries} journal={d.journal} quizResult={d.quizResult} historyModules={d.historyModules} profile={d.profile} />; }

/* Landing page -> real application flow.
   New visitors go to the sign-up form; signed-in users go straight to their profile; "Sign In" opens the login form. */
function LandingRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <LandingPage
      isSignedIn={!!user}
      onStart={() => (user ? navigate("/app/profile") : navigate("/auth", { state: { mode: "signup" } }))}
      onSignIn={() => (user ? navigate("/app/profile") : navigate("/auth", { state: { mode: "login" } }))}
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app" element={<ProtectedRoute><AppDataProvider><DashboardLayout /></AppDataProvider></ProtectedRoute>}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileRoute />} />
        <Route path="skincare" element={<SkincareRoute />} />
        <Route path="makeup" element={<MakeupRoute />} />
        <Route path="ingredients" element={<IngredientsRoute />} />
        <Route path="aiguide" element={<AiGuideRoute />} />
        <Route path="tracker" element={<TrackerRoute />} />
        <Route path="journal" element={<JournalRoute />} />
        <Route path="favorites" element={<FavoritesRoute />} />
        <Route path="tips" element={<TipsRoute />} />
        <Route path="progress" element={<ProgressRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Search from "./pages/Search";
import SearchResults from "./pages/SearchResults";
import AdminAddTrain from "./pages/AdminAddTrain";
import BookTrain from "./pages/BookTrain";
import Confirmation from "./pages/Confirmation";
import CancelBooking from "./pages/CancelBooking";
import PNRStatus from "./pages/PNRStatus";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/results" element={<SearchResults />} />
          <Route path="/pnr" element={<PNRStatus />} />
          <Route path="/pnr/:pnr" element={<PNRStatus />} />
          
          {/* Auth routes - only accessible when not authenticated */}
          <Route path="/login" element={
            <ProtectedRoute redirectTo="/" onlyUnauthenticated>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/register" element={
            <ProtectedRoute  redirectTo="/" onlyUnauthenticated>
              <Register />
            </ProtectedRoute>
          } />

          {/* Protected routes - require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/book/:trainId" element={<BookTrain />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/cancel" element={<CancelBooking />} />
          </Route>

          {/* Admin routes - require admin role */}
          <Route element={
            <ProtectedRoute roles={['Admin']}>
              <AdminRoute />
            </ProtectedRoute>
          }>
            <Route path="/admin/add-train" element={<AdminAddTrain />} />
          </Route>

          {/* 404 - Keep at the bottom */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

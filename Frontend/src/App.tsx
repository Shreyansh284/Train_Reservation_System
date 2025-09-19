import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./components/ThemeProvider";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminRoute, ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loading } from "@/components/ui/loading";

// Lazy load components for better performance
const Navigation = lazy(() => import("./components/Navigation"));
const Index = lazy(() => import("./pages/Index"));
const Search = lazy(() => import("./pages/Search"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const AdminAddTrain = lazy(() => import("./pages/AdminAddTrain"));
const BookingReport = lazy(() => import("./pages/BookingReport"));
const Trains = lazy(() => import("./pages/Trains"));
const BookTrain = lazy(() => import("./pages/BookTrain"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const CancelBooking = lazy(() => import("./pages/CancelBooking"));
const PNRStatus = lazy(() => import("./pages/PNRStatus"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const queryClient = new QueryClient();
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));

const AppContent = () => {
  return (
    <Suspense fallback={<Loading className="min-h-screen" />}>
      <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
        <Navigation />
        <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 md:py-6">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/results" element={<SearchResults />} />


            {/* Auth routes - only accessible when not authenticated */}
            <Route path="/login" element={
              <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                <ProtectedRoute redirectTo="/" onlyUnauthenticated>
                  <Login />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/register" element={
              <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                <ProtectedRoute redirectTo="/" onlyUnauthenticated>
                  <Register />
                </ProtectedRoute>
              </Suspense>
            } />

            {/* Protected routes - require authentication */}
            <Route element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }>
              <Route path="/book/:trainId" element={
                <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                  <BookTrain />
                </Suspense>
              } />
              <Route path="/confirmation" element={
                <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                  <Confirmation />
                </Suspense>
              } />
              <Route path="/pnr" element={<PNRStatus />} />
              <Route path="/pnr/:pnr" element={<PNRStatus />} />
              <Route path="/cancel" element={
                <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                  <CancelBooking />
                </Suspense>
              } />
            </Route>

            {/* Admin routes - require admin role */}
            <Route element={
              <ProtectedRoute roles={['Admin']}>
                <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                  <AdminRoute />
                </Suspense>
              </ProtectedRoute>
            }>
              <Route element={<Suspense fallback={<Loading className="min-h-[60vh]" />}><AdminLayout><Outlet /></AdminLayout></Suspense>}>
                <Route path="/admin/add-train" element={
                  <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                    <AdminAddTrain />
                  </Suspense>
                } />
                <Route path="/admin/booking-report" element={
                  <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                    <BookingReport />
                  </Suspense>
                } />
                <Route path="/admin/trains" element={
                  <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                    <Trains />
                  </Suspense>
                } />
              </Route>
            </Route>

            {/* 404 - Keep at the bottom */}
            <Route path="*" element={
              <Suspense fallback={<Loading className="min-h-[60vh]" />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </main>
        <Toaster />
        <Sonner />
      </div>
    </Suspense>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Search from "./pages/Search";
import AdminAddTrain from "./pages/AdminAddTrain";
import BookTrain from "./pages/BookTrain";
import Confirmation from "./pages/Confirmation";
import CancelBooking from "./pages/CancelBooking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin/add-train" element={<AdminAddTrain />} />
            <Route path="/book/:trainId" element={<BookTrain />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/cancel" element={<CancelBooking />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

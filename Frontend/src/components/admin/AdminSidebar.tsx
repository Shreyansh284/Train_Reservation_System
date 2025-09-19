import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Train, Plus, FileText, X, PanelLeftClose } from "lucide-react";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Backdrop on small screens when open */}
      <div
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 bg-black/40 z-40 transition-opacity lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed z-40 top-[56px] left-0 h-[calc(100vh-56px)] bg-card text-card-foreground border-r border-border",
          "w-72 p-4 flex flex-col gap-2 shadow-lg transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:w-64"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-2 grid gap-1">
          <Link to="/admin/trains">
            <Button
              variant={isActive("/admin/trains") ? "railway" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={onClose}
            >
              <Train className="h-4 w-4" />
              Trains
            </Button>
          </Link>
          <Link to="/admin/add-train">
            <Button
              variant={isActive("/admin/add-train") ? "railway" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={onClose}
            >
              <Plus className="h-4 w-4" />
              Add Train
            </Button>
          </Link>
          <Link to="/admin/booking-report">
            <Button
              variant={isActive("/admin/booking-report") ? "railway" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={onClose}
            >
              <FileText className="h-4 w-4" />
              Booking Report
            </Button>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Manage trains, routes, and bookings. More controls coming soon.
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

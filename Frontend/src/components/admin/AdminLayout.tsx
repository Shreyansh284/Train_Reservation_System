import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSidebar from "./AdminSidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const SIDEBAR_KEY = "adminSidebar.open";

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [open, setOpen] = useState<boolean>(false);

  // Load initial preference
  useEffect(() => {
    const raw = localStorage.getItem(SIDEBAR_KEY);
    if (raw === null) {
      // Default closed
      setOpen(false);
    } else {
      setOpen(raw === "true");
    }
  }, []);

  // Allow navbar to toggle via a window event
  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener('admin-sidebar-toggle', handler);
    return () => window.removeEventListener('admin-sidebar-toggle', handler);
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(open));
  }, [open]);

  return (
    <div className="relative min-h-[calc(100vh-56px)]">{/* minus navbar height */}
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      {/* Content shifts on large screens only when sidebar is open */}
      <div className={`transition-all duration-300 ${open ? "lg:ml-64" : "lg:ml-0"}`}>
        <div className="px-1 sm:px-2 md:px-4">{children}</div>
      </div>

      {/* Admin-only persistent toggle: pinned under navbar; adjusts when sidebar is open */}
      <div
        className={cn(
          "fixed z-40 top-[72px]",
          open ? "left-2 hidden lg:block lg:left-[272px]" : "left-2 block"
        )}
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close admin sidebar" : "Open admin sidebar"}
        >
          {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default AdminLayout;

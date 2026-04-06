import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { QuarterProvider } from "@/lib/QuarterContext";
import { QuarterSelector } from "@/components/QuarterSelector";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/teams/infra", label: "Infraestructura" },
  { to: "/teams/cs", label: "Customer Success" },
];

export function Layout() {
  return (
    <QuarterProvider>
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container flex h-14 items-center">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 mr-8">
              <div className="h-6 w-1.5 rounded-full bg-etendo-blue" />
              <span className="font-semibold text-sm">
                OKR Platform{" "}
                <span className="text-etendo-blue">Etendo Go</span>
              </span>
            </Link>
            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {/* Quarter selector */}
            <div className="ml-auto">
              <QuarterSelector />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="container py-8">
          <Outlet />
        </main>
      </div>
    </QuarterProvider>
  );
}

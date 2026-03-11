import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <AppHeader />
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;

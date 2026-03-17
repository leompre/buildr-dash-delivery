import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  return (
    <>
      <AppHeader />
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;

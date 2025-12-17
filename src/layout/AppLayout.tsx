import { Outlet } from "react-router-dom";
import Header from "../components/organisms/Header/Header";

const AppLayout: React.FC = () => {
  return (
    <div className="app-body">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 DevBoard</p>
      </footer>
    </div>
  );
};

export default AppLayout;

import { Outlet } from "react-router-dom";


const AppLayout: React.FC = () => {
  return (
	<div>
	    <header>
		<h1>My Application</h1>
	    </header>
	    <main>
		<Outlet />
	    </main>
	    <footer>
		<p>&copy; 2025 DevBoard</p>
	    </footer>
	</div>
  );
}

export default AppLayout;

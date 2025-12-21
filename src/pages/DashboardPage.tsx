import styles from "../styles/Pages/DashboardPage.module.css";
import Card from "../components/modules/Card/Card";
import { useProjects } from "../shared/hooks/useProjects";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Dashboard</h1>
        <button
          className={styles.btn}
          onClick={() => {
            navigate("/add-project");
          }}
        >
          Add project
        </button>
      </div>
      <p className={styles.description}>Welcome to your dashboard!</p>
      <div className={styles.content}>
        {projects.length > 0 ? (
          <>
            {projects.map((data, index) => (
              <Card
                key={index}
                id={data.id}
                title={data.title}
                status={data.status}
                type="project"
              />
            ))}{" "}
          </>
        ) : (
          <p className={styles.description}>
            No projects found.
            <br />
            Start by clicking the "Add project" button.
          </p>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;

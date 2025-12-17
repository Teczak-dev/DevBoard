import styles from "../styles/Pages/DashboardPage.module.css";
import { TestData } from "../../data/TestData";
import Card from "../components/modules/Card/Card";

const DashboardPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Dashboard</h1>
        <button
          className={styles.btn}
          onClick={() => {
            console.log("Button clicked");
          }}
        >
          Add project
        </button>
      </div>
      <p className={styles.description}>Welcome to your dashboard!</p>
      <div className={styles.content}>
        {TestData.map((data, index) => (
          <Card
            key={index}
            id={data.id}
            title={data.title}
            status={data.status}
            type="project"
          />
        ))}
        {TestData.map((data, index) => (
          <Card
            key={index}
            id={data.id}
            title={data.title}
            status={data.status}
            type="project"
          />
        ))}
        {TestData.map((data, index) => (
          <Card
            key={index}
            id={data.id}
            title={data.title}
            status={data.status}
            type="project"
          />
        ))}
      </div>
    </div>
  );
};
export default DashboardPage;

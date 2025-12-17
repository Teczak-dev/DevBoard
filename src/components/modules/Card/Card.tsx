import { useNavigate } from "react-router-dom";
import styles from "./Card.module.css";
interface CardProps {
  id: number;
  title: string;
  status: string;
  type: "project" | "snippet" | "markdown";
}

const Card = ({ id, title, status, type }: CardProps) => {
  const navigation = useNavigate();

  const handleCardClick = () => {
    if (type === "project") navigation(`/project/${id}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardText}>{status}</p>
        <div
          className={status === "active" ? styles.active : styles.inactive}
        ></div>
      </div>
      {type === "project" && (
        <div className={styles.cardFooter}>
          <button className={styles.btn} onClick={handleCardClick}>
            View Project
          </button>
        </div>
      )}
      {type === "snippet" && (
        <div className={styles.cardFooter}>
          <button className={styles.btn} onClick={handleCardClick}>
            View Snippet
          </button>
        </div>
      )}
      {type === "markdown" && (
        <div className={styles.cardFooter}>
          <button className={styles.btn} onClick={handleCardClick}>
            View Markdown
          </button>
        </div>
      )}
    </div>
  );
};
export default Card;

import { useState } from "react";
import styles from "./Sidebar.module.css";
import closeIcon from "../../../assets/close.svg";
import { NavLink } from "react-router-dom";

const Sidebar = ({ toggle }: { toggle: () => void }) => {
  const [hide, setHide] = useState(false);

  const handleClose = () => {
    setHide(true);
    setTimeout(() => {
      toggle();
      setHide(false);
    }, 300);
  };
  return (
    <>
      <div className={styles.closeDiv} onClick={handleClose}></div>
      <div className={`${styles.sidebar} ${hide ? styles.sidebar_hide : ""}`}>
        <h2 className={styles.sidebar_title}>Menu</h2>
        <div className={styles.sidebar_list}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebar_item} ${styles.sidebar_selected}`
                : styles.sidebar_item
            }
            onClick={handleClose}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/snippets"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebar_item} ${styles.sidebar_selected}`
                : styles.sidebar_item
            }
            onClick={handleClose}
          >
            Snippets
          </NavLink>
          <NavLink
            to="/markdown-editor"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebar_item} ${styles.sidebar_selected}`
                : styles.sidebar_item
            }
            onClick={handleClose}
          >
            Markdown Editor
          </NavLink>
          <NavLink
            to="/projects-todo"
            className={({ isActive }) =>
              isActive
                ? `${styles.sidebar_item} ${styles.sidebar_selected}`
                : styles.sidebar_item
            }
            onClick={handleClose}
          >
            Projects TODO
          </NavLink>
        </div>
        <button className={styles.close_button} onClick={handleClose}>
          <img src={closeIcon} className={styles.close_button_icon} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;

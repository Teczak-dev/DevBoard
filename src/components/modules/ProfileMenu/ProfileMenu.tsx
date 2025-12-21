import styles from "./ProfileMenu.module.css";

const ProfileMenu = ({ toggle }: { toggle: () => void }) => {
  return (
    <div className={styles.profileClose} onClick={toggle}>
      <div className={styles.profileMenu}>
        <button className={styles.items}>Settings</button>
        <button className={styles.items} onClick={toggle}>
          Close
        </button>
      </div>
    </div>
  );
};
export default ProfileMenu;

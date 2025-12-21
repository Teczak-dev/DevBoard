import { useState } from "react";
import Sidebar from "../../modules/Sidebar/Sidebar";
import styles from "./Header.module.css";
import { useTheme } from "../../../shared/hooks/useTheme";
import type { Theme } from "../../../context/ThemeContext";
import hamburger from "../../../assets/hamburger.svg";
import profile from "../../../assets/profile.svg";
import { MenuItem, Select } from "@mui/material";
import ProfileMenu from "../../modules/ProfileMenu/ProfileMenu";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpenSlider, setIsOpenSlider] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const toggleSidebar = () => {
    setIsOpenSlider(!isOpenSlider);
  };
  const toggleProfile = () => {
    setIsOpenProfile(!isOpenProfile);
  };

  const changeTheme = (value: string | Theme) => {
    toggleTheme(value as Theme);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left_section}>
        <button onClick={toggleSidebar} className={styles.hamburger}>
          <img src={hamburger} alt="hamburger menu" />
        </button>
      </div>
      <div className={styles.right_section}>
        <input type="text" placeholder="Search..." />
        <Select
          value={theme}
          onChange={(e) => changeTheme(e.target.value)}
          sx={{
            overflow: "hidden",
            minWidth: 100,
            height: 40,
            borderRadius: "5px",
            background: "var(--surface)",
            color: "var(--text)",
            padding: 0,
            fontSize: "14px",
            lineHeight: "34px",
            border: "1px solid var(--border)",
            transition: "ease-in-out 200ms",
            "&:hover": {
              backgroundColor: "var(--hover-bg)",
            },
            // target internal MUI slots so styling works across themes
            ".MuiSelect-select": {
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              height: "34px",
            },
            ".MuiSelect-icon": {
              color: "var(--text)",
              right: 8,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                background: "var(--surface)",
                color: "var(--text)",
                borderRadius: "5px",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              },
            },
            MenuListProps: {
              sx: {
                padding: "8px",
                background: "var(--surface)",
                color: "var(--text)",
              },
            },
          }}
        >
          <MenuItem
            value="dark"
            sx={{
              width: 100,
              height: 34,
              borderRadius: "5px",
              background: "var(--surface)",
              color: "var(--text)",
              padding: "0 10px",
              fontSize: "14px",
              lineHeight: "34px",
              transition: "ease-in-out 200ms",
              "&:hover": {
                backgroundColor: "var(--hover-bg)",
              },
            }}
          >
            Dark
          </MenuItem>
          <MenuItem
            value="light"
            sx={{
              width: 100,
              height: 34,
              borderRadius: "5px",
              background: "var(--surface)",
              color: "var(--text)",
              padding: "0 10px",
              fontSize: "14px",
              lineHeight: "34px",
              transition: "ease-in-out 200ms",
              "&:hover": {
                backgroundColor: "var(--hover-bg)",
              },
            }}
          >
            Light
          </MenuItem>
          <MenuItem
            value="system"
            sx={{
              width: 100,
              height: 34,
              borderRadius: "5px",
              background: "var(--surface)",
              color: "var(--text)",
              padding: "0 10px",
              fontSize: "14px",
              lineHeight: "34px",
              transition: "ease-in-out 200ms",
              "&:hover": {
                backgroundColor: "var(--hover-bg)",
              },
            }}
          >
            System
          </MenuItem>
        </Select>
        <button className={styles.profile} onClick={toggleProfile}>
          <img src={profile} alt="user profile" />
        </button>
      </div>
      {isOpenProfile && <ProfileMenu toggle={toggleProfile} />}
      {isOpenSlider && <Sidebar toggle={toggleSidebar} />}
    </header>
  );
};
export default Header;

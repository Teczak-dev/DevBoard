import React from "react";
import { Link } from "react-router-dom";

type BackActionProps = {
  /**
   * If provided, BackAction renders a react-router `Link` to this path.
   * Otherwise it renders a clickable element that invokes `onClick`.
   */
  to?: string;
  /**
   * Click handler when not using `to` (i.e. non-navigation cancel/back action).
   */
  onClick?: () => void;
  /**
   * Visible label for the control.
   */
  label?: string;
  /**
   * Optional CSS class name. Defaults to `backLink` which matches existing styles
   * used across the project (e.g. AddProject.module.css/backLink).
   */
  className?: string;
  /**
   * Optional aria-label for improved accessibility. If omitted the `label`
   * value will be used.
   */
  ariaLabel?: string;
  /**
   * Whether to render the Link as replace (replace history entry). Only applies when `to` is set.
   */
  replace?: boolean;
};

/**
 * BackAction
 *
 * Reusable small component for "Back" / "Cancel" actions.
 * - If `to` is provided, renders a react-router `Link`.
 * - Otherwise renders an interactive element that calls `onClick`.
 *
 * The component intentionally keeps markup minimal so existing CSS modules
 * (for example `.backLink` in AddProject styles) can be reused by passing
 * the appropriate `className`.
 */
const BackAction: React.FC<BackActionProps> = ({
  to,
  onClick,
  label = "Back",
  className,
  ariaLabel,
  replace = false,
}) => {
  const aria = ariaLabel ?? label;

  if (to) {
    return (
      <Link to={to} className={className ?? "backLink"} aria-label={aria} replace={replace}>
        {label}
      </Link>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // support Enter / Space activation for keyboard users
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick && onClick();
    }
  };

  return (
    // Use <a> with role="button" to be compatible with existing styles that expect links,
    // but behave like a button for non-navigation actions.
    <a
      role="button"
      tabIndex={0}
      className={className ?? "backLink"}
      aria-label={aria}
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick();
      }}
      onKeyDown={handleKeyDown}
    >
      {label}
    </a>
  );
};

export default BackAction;

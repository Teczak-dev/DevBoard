import React, { forwardRef, ReactNode } from "react";
import styles from "../../styles/Pages/AddProject.module.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface LabeledFieldProps {
  /**
   * Visible label text
   */
  label: string;
  /**
   * Unique id for the input/textarea. Also used by the <label htmlFor>.
   */
  id?: string;
  /**
   * Optional helper / hint text displayed under the control
   */
  help?: string;
  /**
   * Optional validation error text. When provided it's displayed and can be styled.
   */
  error?: string | null;
  /**
   * If true, renders a textarea instead of an input
   */
  textarea?: boolean;
  /**
   * Attributes forwarded to the underlying input / textarea
   */
  inputProps?: InputProps;
  /**
   * If you want to render custom children instead of the default input/textarea,
   * place them here. When children are present, `inputProps`, `textarea` and
   * automatic id handling are ignored.
   */
  children?: ReactNode;
  /**
   * Additional CSS class applied to the container (the `.field` wrapper)
   */
  className?: string;
  /**
   * Whether the field is required (adds `aria-required` and visual marker)
   */
  required?: boolean;
}

/**
 * LabeledField
 *
 * Small, accessible form primitive that pairs a label with an input/textarea
 * (or custom children). It integrates with existing project styles that define
 * `.field`, `.inputfull` and `.error` classes in AddProject.module.css.
 *
 * Usage:
 * <LabeledField label="Name" id="name" inputProps={{ value, onChange }} />
 *
 * Or with custom children:
 * <LabeledField label="Content"><RichTextEditor ... /></LabeledField>
 */
const LabeledField = forwardRef<HTMLInputElement | HTMLTextAreaElement, LabeledFieldProps>(
  (
    {
      label,
      id,
      help,
      error = null,
      textarea = false,
      inputProps,
      children,
      className,
      required = false,
    },
    ref,
  ) => {
    // If no explicit id provided, try to derive one to associate label and control
    const generatedId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

    const containerClass = `${styles.field} ${className ?? ""}`.trim();
    const inputClass = `${styles.inputfull}`.trim();

    return (
      <div className={containerClass}>
        <label htmlFor={generatedId} style={{ fontWeight: 600 }}>
          {label}
          {required ? " *" : null}
        </label>

        {children ? (
          // When custom children are provided, we render them as-is. It's the caller's responsibility
          // to ensure the child control is associated with the label (id / aria attributes).
          <div>{children}</div>
        ) : textarea ? (
          <textarea
            id={generatedId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClass}
            aria-invalid={Boolean(error)}
            aria-describedby={help || error ? `${generatedId}-help` : undefined}
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={generatedId}
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClass}
            aria-invalid={Boolean(error)}
            aria-describedby={help || error ? `${generatedId}-help` : undefined}
            {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {(error || help) && (
          <div id={`${generatedId}-help`}>
            {error ? <div className={styles.error}>{error}</div> : null}
            {!error && help ? <div className={styles.muted}>{help}</div> : null}
          </div>
        )}
      </div>
    );
  },
);

LabeledField.displayName = "LabeledField";

export default LabeledField;

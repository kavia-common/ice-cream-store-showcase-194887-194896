import React from "react";
import styles from "./Button.module.css";

/**
 * Reusable Button component (Ocean Professional theme).
 *
 * Supports variants (primary/secondary/outline/ghost), sizes (sm/md/lg),
 * fullWidth, disabled/loading states, optional left/right icons, and polymorphic
 * rendering via `as` (e.g., "button", "a", or a custom component).
 *
 * Usage:
 *   <Button variant="primary" onClick={...}>Save</Button>
 *   <Button as="a" href="/menu" variant="outline">View menu</Button>
 *   <Button loading leftIcon={<Icon/>}>Submitting</Button>
 */
const Button = React.forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    as: Component = "button",
    type = "button",
    onClick,
    className = "",
    children,
    // Allow passing through arbitrary props like href, target, rel, aria-*, etc.
    ...rest
  },
  ref
) {
  const isDisabled = Boolean(disabled || loading);

  const classes = [
    styles.button,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth ? styles.fullWidth : "",
    isDisabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isNativeButton = Component === "button";
  const isAnchor = Component === "a";

  // For anchors and non-button elements, ensure disabled/loading prevents action.
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  // Provide button-like keyboard behavior when not using a native button.
  // If consumer passes their own onKeyDown, we still preserve it.
  const handleKeyDown = (e) => {
    if (isDisabled) return;

    // Activate on Enter/Space like a button when role=button
    if (!isNativeButton) {
      const key = e.key;
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        // Trigger click semantics.
        // eslint-disable-next-line no-unused-expressions
        e.currentTarget?.click?.();
      }
    }
    rest.onKeyDown?.(e);
  };

  const sharedProps = {
    ref,
    className: classes,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "aria-busy": loading ? true : undefined,
    "aria-disabled": !isNativeButton && isDisabled ? true : undefined,
    ...rest,
  };

  // Native button semantics
  if (isNativeButton) {
    return (
      <button
        {...sharedProps}
        type={type}
        disabled={isDisabled}
        data-loading={loading ? "true" : "false"}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={styles.content}>{children}</span>
        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }

  // Anchor: prefer native link role. Also handle "disabled" by removing tab stop.
  if (isAnchor) {
    return (
      <a
        {...sharedProps}
        role={undefined}
        tabIndex={isDisabled ? -1 : rest.tabIndex}
        data-loading={loading ? "true" : "false"}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true" />
        )}
        {leftIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={styles.content}>{children}</span>
        {rightIcon && (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </a>
    );
  }

  // Other elements: apply button semantics for accessibility.
  return (
    <Component
      {...sharedProps}
      role={rest.role ?? "button"}
      tabIndex={rest.tabIndex ?? (isDisabled ? -1 : 0)}
      data-loading={loading ? "true" : "false"}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {leftIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className={styles.content}>{children}</span>
      {rightIcon && (
        <span className={styles.icon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </Component>
  );
});

export default Button;

/**
 * Icon-only button variant with enforced accessible labeling.
 * Requires `aria-label` (or `aria-labelledby`) to be provided.
 */
// PUBLIC_INTERFACE
export const ButtonIconOnly = React.forwardRef(function ButtonIconOnly(
  { children, className = "", ...props },
  ref
) {
  const hasAriaLabel =
    typeof props["aria-label"] === "string" && props["aria-label"].trim() !== "";
  const hasAriaLabelledBy =
    typeof props["aria-labelledby"] === "string" &&
    props["aria-labelledby"].trim() !== "";

  if (process.env.NODE_ENV !== "production" && !hasAriaLabel && !hasAriaLabelledBy) {
    // eslint-disable-next-line no-console
    console.error(
      "[ButtonIconOnly] Missing accessible label. Provide `aria-label` or `aria-labelledby`."
    );
  }

  return (
    <Button
      {...props}
      ref={ref}
      className={[styles.iconOnly, className].filter(Boolean).join(" ")}
    >
      {children}
    </Button>
  );
});

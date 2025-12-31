import React from "react";
import styles from "./Card.module.css";

/**
 * Card (Ocean Professional theme)
 *
 * A reusable surface container with optional header/footer and composition slots.
 *
 * Minimal usage:
 *   <Card variant="elevated" padding="md" radius="md" hover>
 *     <Card.Header>Featured</Card.Header>
 *     <Card.Body>Content…</Card.Body>
 *     <Card.Footer>Actions…</Card.Footer>
 *   </Card>
 *
 * Polymorphic usage:
 *   <Card as="a" href="/product/1" hover shadow className="myCard">
 *     <Card.Body>Clickable card</Card.Body>
 *   </Card>
 */

// PUBLIC_INTERFACE
const Card = React.forwardRef(function Card(
  {
    variant = "default", // default | elevated | outline
    as: Component = "div",
    shadow = false,
    hover = false,
    padding = "md", // sm | md | lg
    radius = "md", // sm | md | lg
    className = "",
    children,
    header,
    footer,
    // Allow aria-* passthrough and other DOM props (id, data-*, onClick, tabIndex, etc.)
    ...rest
  },
  ref
) {
  const isAnchor = Component === "a";
  const isClickable =
    typeof rest.onClick === "function" ||
    isAnchor ||
    (typeof rest.tabIndex === "number" && rest.tabIndex >= 0);

  const classes = [
    styles.card,
    styles[`variant_${variant}`],
    styles[`padding_${padding}`],
    styles[`radius_${radius}`],
    shadow ? styles.shadow : "",
    hover ? styles.hover : "",
    isClickable ? styles.clickable : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * Accessibility notes:
   * - We intentionally do NOT force a role. The implicit role from `as` should win.
   * - Focus ring is provided for keyboard users when the card is focusable/clickable.
   */
  return (
    <Component ref={ref} className={classes} {...rest}>
      {header != null ? <CardHeader>{header}</CardHeader> : null}
      {children}
      {footer != null ? <CardFooter>{footer}</CardFooter> : null}
    </Component>
  );
});

function sectionClassNames(baseClass, className) {
  return [baseClass, className].filter(Boolean).join(" ");
}

/** Card.Header slot */
// PUBLIC_INTERFACE
const CardHeader = React.forwardRef(function CardHeader(
  { className = "", children, ...rest },
  ref
) {
  return (
    <header
      ref={ref}
      className={sectionClassNames(styles.header, className)}
      {...rest}
    >
      {children}
    </header>
  );
});

/** Card.Body slot */
// PUBLIC_INTERFACE
const CardBody = React.forwardRef(function CardBody(
  { className = "", children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={sectionClassNames(styles.body, className)}
      {...rest}
    >
      {children}
    </div>
  );
});

/** Card.Footer slot */
// PUBLIC_INTERFACE
const CardFooter = React.forwardRef(function CardFooter(
  { className = "", children, ...rest },
  ref
) {
  return (
    <footer
      ref={ref}
      className={sectionClassNames(styles.footer, className)}
      {...rest}
    >
      {children}
    </footer>
  );
});

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

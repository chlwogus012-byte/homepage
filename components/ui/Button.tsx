import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "ghost";

type BaseProps = {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "border border-border text-text hover:bg-background",
  ghost: "text-text hover:text-primary",
};

export function Button({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-5 py-3 text-sm font-medium transition-colors",
    VARIANT_CLASSES[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
        {arrow ? <span aria-hidden="true">→</span> : null}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, "href">;
  return (
    <button className={classes} {...buttonRest}>
      {children}
      {arrow ? <span aria-hidden="true">→</span> : null}
    </button>
  );
}

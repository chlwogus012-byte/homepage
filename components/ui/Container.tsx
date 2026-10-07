import type { ReactNode } from "react";

type ContainerProps = {
  className?: string;
  children: ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  const classes = ["mx-auto w-full px-6", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={{ maxWidth: "var(--container-max)" }}>
      {children}
    </div>
  );
}

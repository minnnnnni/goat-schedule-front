import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return <button {...rest}>{children}</button>;
}


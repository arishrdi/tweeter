import React, { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <section className="min-h-screen bg-gray-100 pt-5">
      <div className="mx-20 ">{children}</div>
    </section>
  );
}

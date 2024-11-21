"use client";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@material-tailwind/react";

interface RecoilRootWrapperProps {
  children: React.ReactNode;
}

export default function RecoilRootWrapper({
  children,
}: RecoilRootWrapperProps) {
  return (
    <RecoilRoot>
      <ThemeProvider>{children}</ThemeProvider>;
    </RecoilRoot>
  );
}

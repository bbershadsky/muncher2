import * as React from "react";
import type { LayoutProps } from "@refinedev/core";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-red">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-[#fff] px-24 py-8">
        {/* <a href="https://refine.dev">
          <img src="./refine_logo.png" alt="refine logo" />
        </a> */}
      </div>
      <div className="grid-rows-3">{children}</div>
    </div>
  );
};

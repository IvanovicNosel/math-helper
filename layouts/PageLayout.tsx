import Link from "next/link";
import Router from "next/router";
import { PropsWithChildren } from "react";

/**
 * Renders a page with a title and a content area and a back button.
 * The back button is leveraging next router.
 */
const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/"
          onClick={() => Router.back()}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h1 className={`mb-3 text-2xl font-semibold`}>
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &lt;-
            </span>{" "}
            Back
          </h1>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}></p>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default PageLayout;

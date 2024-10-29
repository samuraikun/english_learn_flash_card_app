import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: styles },
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Error | Flash Cards</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

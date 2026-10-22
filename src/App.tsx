// Static build entry — uses TanStack Router for multi-page navigation
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const router = getRouter();

export default function App() {
  return <RouterProvider router={router} />;
}

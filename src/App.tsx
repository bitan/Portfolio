// Static build entry — imports the portfolio component directly
// bypassing TanStack Start's SSR router
import { Route } from "./routes/index";

const Index = Route.options.component as React.ComponentType;
export default Index;

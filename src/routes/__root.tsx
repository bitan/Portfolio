import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { ScrollProgressBar, BackToTop } from "@/components/ScrollUI";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="font-mono text-sm font-bold tracking-tight hover:opacity-70 transition-opacity">
            nabi<span className="text-blue-500">.</span>dev
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="text-center max-w-md">
          <p className="font-mono text-blue-500 text-xs mb-4 uppercase tracking-widest">404</p>
          <h1 className="text-6xl md:text-8xl font-bold font-serif tracking-tight mb-4">
            Lost?
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            This page doesn't exist or has been moved. Let's get you back somewhere useful.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all">
              Go home
            </Link>
            <Link to="/projects" className="border border-foreground/20 px-6 py-2.5 rounded-full text-sm hover:border-blue-500 hover:text-blue-500 transition-all">
              View projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ScrollProgressBar />
        <div
          style={{
            opacity: isLoading ? 0.6 : 1,
            transition: "opacity 0.15s ease",
          }}
        >
          <Outlet />
        </div>
        <BackToTop />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <h2 className="font-serif text-2xl text-navy">Something went wrong</h2>
            <p className="mt-2 text-navy/70">
              Please refresh the page or try again later.
            </p>
            <button
              className="btn-primary mt-6"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

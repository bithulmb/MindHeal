import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeProvider";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store";
import { Toaster } from "sonner";
import { GOOGLE_CLIENT_ID } from "./utils/constants/constants";
import CommonRoutes from "./routes/CommonRoutes";
import UserRoutes from "./routes/UserRoutes";
import PsychologistRoutes from "./routes/PsychologistRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Suspense } from "react";
import FullScreenLoader from "./components/ui/FullScreenLoader";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/common/ErrorFallback";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <BrowserRouter>
          
          <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<FullScreenLoader/>}>
          <ScrollToTop/>
            <Routes>                               
              {CommonRoutes()}
              {UserRoutes()}
              {PsychologistRoutes()}
              {AdminRoutes()}
            </Routes>
          
          </Suspense>
          </ErrorBoundary>
          
          </BrowserRouter>
          <Toaster />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

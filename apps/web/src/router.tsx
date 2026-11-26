import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RootLayout } from "./routes/__root";
import { ExampleRoute } from "./routes/example";
import { LandingPageRoute } from "./routes/landing-page";
import { ChargebackDashboardRoute } from "./routes/chargeback-dashboard";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPageRoute />} />
          <Route path="/example" element={<ExampleRoute />} />
          <Route path="/dashboard" element={<ChargebackDashboardRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

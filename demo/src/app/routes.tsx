import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import OperativeDashboardPage from "./pages/OperativeDashboardPage";
import CollectionRegistrationPage from "./pages/CollectionRegistrationPage";
import EcaClassificationPage from "./pages/EcaClassificationPage";
import MassBalancePage from "./pages/MassBalancePage";
import DirectorDashboardPage from "./pages/DirectorDashboardPage";
import DirectorAuthorizationPage from "./pages/DirectorAuthorizationPage";
import ContractFilePage from "./pages/ContractFilePage";
import NewTenderProcessPage from "./pages/NewTenderProcessPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  // --- ADMIN ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: "/admin/dashboard",
        Component: AdminDashboardPage,
      },
    ]
  },
  // --- DIRECTOR ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={['DIRECTOR']} />,
    children: [
      {
        path: "/director/dashboard",
        Component: DirectorDashboardPage,
      },
      {
        path: "/director/authorization",
        Component: DirectorAuthorizationPage,
      },
      {
        path: "/director/contract-file",
        Component: ContractFilePage,
      },
      {
        path: "/director/new-process",
        Component: NewTenderProcessPage,
      },
    ]
  },
  // --- OPERATIVE ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={['ANALYST', 'OPERATOR']} />,
    children: [
      {
        path: "/operative/dashboard",
        Component: OperativeDashboardPage,
      },
      {
        path: "/operative/collection",
        Component: CollectionRegistrationPage,
      },
      {
        path: "/operative/eca-classification",
        Component: EcaClassificationPage,
      },
      {
        path: "/operative/mass-balance",
        Component: MassBalancePage,
      },
    ]
  },
  {
    path: "*",
    Component: () => <div className="p-4 text-center">404 - Página no encontrada</div>,
  }
]);

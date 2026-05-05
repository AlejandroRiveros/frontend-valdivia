import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import OperativeDashboardPage from "./pages/OperativeDashboardPage";
import CollectionRegistrationPage from "./pages/CollectionRegistrationPage";
import EcaClassificationPage from "./pages/EcaClassificationPage";
import MassBalancePage from "./pages/MassBalancePage";
import AnalystProcessesPage from "./pages/AnalystProcessesPage";
import AnalystNewProcessPage from "./pages/AnalystNewProcessPage";
import AnalystDeliverablesPage from "./pages/AnalystDeliverablesPage";
import AnalystNewDeliverablePage from "./pages/AnalystNewDeliverablePage";
import DirectorDashboardPage from "./pages/DirectorDashboardPage";
import DirectorAuthorizationPage from "./pages/DirectorAuthorizationPage";
import ContractFilePage from "./pages/ContractFilePage";
import NewTenderProcessPage from "./pages/NewTenderProcessPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import JuridicDashboardPage from "./pages/JuridicDashboardPage";
import JuridicDocReviewPage from "./pages/JuridicDocReviewPage";
import JuridicProcessesPage from "./pages/JuridicProcessesPage";
import SupervisorDashboardPage from "./pages/SupervisorDashboardPage";
import DirectorProcessesPage from "./pages/DirectorProcessesPage";
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
      {
        path: "/director/processes",
        Component: DirectorProcessesPage,
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
      {
        path: "/operative/processes",
        Component: AnalystProcessesPage,
      },
      {
        path: "/operative/processes/new",
        Component: AnalystNewProcessPage,
      },
      {
        path: "/operative/deliverables",
        Component: AnalystDeliverablesPage,
      },
      {
        path: "/operative/deliverables/new",
        Component: AnalystNewDeliverablePage,
      },
    ]
  },
  // --- SUPERVISOR ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={['SUPERVISOR']} />,
    children: [
      {
        path: "/supervisor/dashboard",
        Component: SupervisorDashboardPage,
      },
    ]
  },
  // --- JURIDIC ROUTES ---
  {
    element: <ProtectedRoute allowedRoles={['JURIDIC']} />,
    children: [
      {
        path: "/juridic/dashboard",
        Component: JuridicDashboardPage,
      },
      {
        path: "/juridic/doc-review",
        Component: JuridicDocReviewPage,
      },
      {
        path: "/juridic/processes",
        Component: JuridicProcessesPage,
      },
    ]
  },
  {
    path: "*",
    Component: () => <div className="p-4 text-center">404 - Página no encontrada</div>,
  }
]);

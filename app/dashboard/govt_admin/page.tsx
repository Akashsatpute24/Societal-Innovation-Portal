import Portal from '@/components/portal';
import ProtectedRoute from '@/components/protected-route';
export default function GovernmentDashboard() { return <ProtectedRoute role="government"><Portal initialRole="govt_admin" /></ProtectedRoute>; }

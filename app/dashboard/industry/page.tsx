import Portal from '@/components/portal';
import ProtectedRoute from '@/components/protected-route';
export default function IndustryDashboard() { return <ProtectedRoute role="industry"><Portal initialRole="industry_csr" /></ProtectedRoute>; }

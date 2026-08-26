import Portal from '@/components/portal';
import ProtectedRoute from '@/components/protected-route';
export default function UniversityDashboard() { return <ProtectedRoute role="university"><Portal initialRole="university" /></ProtectedRoute>; }

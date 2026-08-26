import CitizenDashboard from '@/components/citizen-dashboard';
import ProtectedRoute from '@/components/protected-route';
export default function CitizenPage() { return <ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>; }

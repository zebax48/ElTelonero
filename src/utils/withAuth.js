import { useAuth } from '@/Auth/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { auth, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !auth.token) {
        router.push('/auth/login');
      }
    }, [loading, auth]);

    if (loading || !auth.token) {
      return <div className="loaderContainer"><ClipLoader color="#fff" loading={true} size={100} /></div>;
    }

    return <Component {...props} />;
  };
}
import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthStatus } from '../utils/token';
import AuthStatus from '../type/AuthStatus';

interface ProtectedRouteProps {
    children: ReactElement;
    allowedRoles: AuthStatus
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const authStatus = getAuthStatus();

    useEffect(() => {
        if (!allowedRoles.includes(authStatus)) {
            navigate('/');
            setIsAllowed(false);
        } else {
            setIsAllowed(true);
        }
    }, [authStatus, allowedRoles, navigate]);

    if (isAllowed === null) {
        return null;
    }

    return isAllowed ? children : null;
}
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { generateNewAccessToken } from "../features/auth/authThunks";

export default function ProtectedRoute() {
  const dispatch = useAppDispatch();

  const {
    accessToken,
    isAuthenticated,
    initialized,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(generateNewAccessToken());
    }
  }, [dispatch, initialized]);

  // Wait until we've checked for an existing session
  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
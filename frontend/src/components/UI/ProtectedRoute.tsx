import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks.ts";
import { selectUser } from "../../features/users/usersSlice.ts";

interface Props extends React.PropsWithChildren {
  isAllowed: boolean | null;
}

const ProtectedRoute: React.FC<Props> = ({ isAllowed, children }) => {
  const user = useAppSelector(selectUser);

  if (!isAllowed) {
    if (user) {
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;

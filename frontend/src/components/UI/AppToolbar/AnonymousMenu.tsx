import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const AnonymousMenu = () => {
  return (
    <>
      <Button component={NavLink} to="/register" color="inherit">
        Registration
      </Button>
      <Button component={NavLink} to="/login" color="inherit">
        Log in
      </Button>
    </>
  );
};

export default AnonymousMenu;

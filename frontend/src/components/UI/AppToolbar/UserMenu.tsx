import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks.ts";
import { unsetUser } from "../../../features/users/usersSlice.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/users/usersThunks.ts";
import type { User } from "../../../types";

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [userOptionsEl, setUserOptionsEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();

  const handeClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserOptionsEl(event.currentTarget);
  };

  const handleClose = () => {
    setUserOptionsEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      dispatch(unsetUser());
      navigate("/");
      toast.success("Logout is successful");
    } catch (e) {
      toast.error("Logout is failed");
      console.error(e);
    }
  };

  return (
    <>
      <Button onClick={handeClick} color="inherit">
        Hello, {user.username}
      </Button>
      <Menu
        keepMounted
        anchorEl={userOptionsEl}
        open={!!userOptionsEl}
        onClose={handleClose}
      >
        <MenuItem>
          <Button onClick={handleLogout}>Log Out</Button>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

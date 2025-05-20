import { AppBar, Container, styled, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import AnonymousMenu from "./AnonymousMenu.tsx";
import { useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../features/users/usersSlice.ts";
import UserMenu from "./UserMenu.tsx";

const Link = styled(NavLink)({
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    color: "inherit",
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="sticky" sx={{ mb: 2 }}>
      <Toolbar>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/">Chat</Link>
            </Typography>
            <Grid
              container
              justifyContent="space-between"
              spacing={4}
              alignItems="center"
            >
              {user ? <UserMenu user={user} /> : <AnonymousMenu />}
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;

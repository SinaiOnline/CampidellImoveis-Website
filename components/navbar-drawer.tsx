import { Menu } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import { navbarMenuItems } from "./layout/navbar";

const NavbarDrawer = () => {
  const [open, setOpen] = React.useState(false);

  const toggle = (shouldBeOpen: boolean) => {
    setOpen(shouldBeOpen);
  };

  return (
    <div className="navbar-drawer">
      <IconButton
        aria-label="Open menu"
        onClick={() => toggle(true)}
        size="large"
        color="inherit"
        className="sandwich"
      >
        <Menu fontSize="large" />
      </IconButton>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={() => toggle(false)}
        PaperProps={{
          sx: { backgroundColor: "var(--primary-color)", color: "white" },
        }}
      >
        <Box role="presentation" sx={{ width: 300, height: "100%", backgroundColor: "black" }}>
          <List>
            {navbarMenuItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <h6 className="navbar-drawer-submenu-title">{item.label}</h6>
                ) : (
                  <ListItem key={index}>
                    <ListItemButton
                      href={item.href || ""}
                      target={item.target || undefined}
                      sx={{
                        textDecoration: "none",
                        fontWeight: "400",
                        textTransform: "uppercase",
                        "&:hover": {
                          color: "var(--secondary-color)",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                )}
                {item.submenu &&
                  item.submenu.items.map((submenuItem, index) => (
                    <ListItem key={index}>
                      <ListItemButton
                        href={submenuItem.href || ""}
                        target={submenuItem.target}
                        sx={{
                          textDecoration: "none",
                          fontWeight: "400",
                          textTransform: "uppercase",
                          "&:hover": {
                            color: "var(--secondary-color)",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        <ListItemText primary={submenuItem.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </div>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </div>
  );
};

export default NavbarDrawer;

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRightOutlined,
  Groups2Outlined,
  HomeOutlined,
  PointOfSaleOutlined,
  ReceiptLongOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../FlexBetween";
import SettingsIcon from '@mui/icons-material/Settings';
import "./index.css";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Customers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Orders",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Scans",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Check",
    icon: <PointOfSaleOutlined />,
  },
  // {
  //   text: "Setting",
  //   icon: <SettingsIcon />,
  // },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isLargeScreen = useMediaQuery('(min-width:601px)');

  if (isSmallScreen) isSidebarOpen = !isSidebarOpen;

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <div className="sidebar" >
      <Box component="nav">
        {isSmallScreen && isSidebarOpen && (
          <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            variant="persistent"
            anchor="left"
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                color: theme.palette.secondary[200],
                backgroundColor: theme.palette.background.alt,
                boxSixing: "border-box",
                borderWidth: isNonMobile ? 0 : "2px",
                width: drawerWidth,
              },
            }}
          >
            <Box width="100%">
              <Box m="1.5rem 2rem 2rem 3rem">
                <FlexBetween color={theme.palette.secondary.main}>
                  <Box display="flex" alignItems="center" gap="0.5rem">
                    <Typography variant="h4" fontWeight="bold">
                    <img src="logo.png" width={'150px'} height={'150px'} alt="Logo"/>
                    </Typography>
                  </Box>
                  {!isNonMobile && (
                    <IconButton
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      <ChevronLeft />
                    </IconButton>
                  )}
                </FlexBetween>
              </Box>
              <List>
                {navItems.map(({ text, icon }) => {
                  if (!icon) {
                    return (
                      <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                        {text}
                      </Typography>
                    );
                  }
                  const lcText = text.toLowerCase();

                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(`/${lcText}`);
                          setActive(lcText);
                        }}
                        sx={{
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {active === lcText && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Drawer>
        )}


        {isLargeScreen && isSidebarOpen && (
          <Drawer
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            variant="persistent"
            anchor="left"
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                color: theme.palette.secondary[200],
                backgroundColor: theme.palette.background.alt,
                boxSixing: "border-box",
                borderWidth: isNonMobile ? 0 : "2px",
                width: drawerWidth,
              },
            }}
          >
            <Box width="100%">
              <Box m="1.5rem 2rem 2rem 3rem">
                <FlexBetween color={theme.palette.secondary.main}>
                  <Box display="flex" alignItems="center" gap="0.5rem">
                    <Typography variant="h4" fontWeight="bold">
                    <img src="logo.png" width={'150px'} height={'150px'} alt="Logo"/>
                    </Typography>
                  </Box>
                  {!isNonMobile && (
                    <IconButton
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                      <ChevronLeft />
                    </IconButton>
                  )}
                </FlexBetween>
              </Box>
              <List>
                {navItems.map(({ text, icon }) => {
                  if (!icon) {
                    return (
                      <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                        {text}
                      </Typography>
                    );
                  }
                  const lcText = text.toLowerCase();

                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(`/${lcText}`);
                          setActive(lcText);
                        }}
                        sx={{
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {active === lcText && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Drawer>
        )}
      </Box>
    </div>
  );
};

export default Sidebar;

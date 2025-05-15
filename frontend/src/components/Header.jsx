import { LoginButton } from "@components/ui/buttons/LoginButton.jsx";
import { LogoutButton } from "@components/ui/buttons/LogoutButton.jsx";
import { RegisterButton } from "@components/ui/buttons/RegisterButton.jsx";
import { SecondaryButton } from "@components/ui/buttons/SecondaryButton";
import { LogoAvatar } from "@components/ui/LogoAvatar.jsx";
import { BoldTypography } from "@components/ui/typographies/BoldTypography.jsx";
import { LogoTypography } from "@components/ui/typographies/LogoTypography";
import useResponsive from "@hooks/useResponsive";
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectIsAdmin, selectIsAuth, selectUser } from "src/services/store/slices/userSlice.jsx";

export default function Header() {
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);
    const isAdmin = useSelector(selectIsAdmin);
    const { isMobile } = useResponsive();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const MobileDrawer = () => {
        return (
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={handleMenuToggle}
                PaperProps={{
                    sx: {
                        width: { xs: '75%', sm: '50%' },
                        padding: 2,
                        bgcolor: 'background.paper',
                        zIndex: (theme) => theme.zIndex.drawer + 2
                    }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    alignItems: 'flex-start',
                    p: 2
                }}>
                    {isAuth ? (
                        <>
                            {isAdmin && (
                                <Chip label="Адмін" color="warning" size="small" sx={{ mr: 1, fontWeight: 'bold', fontSize: '0.75rem' }} />
                            )}
                            <BoldTypography variant="h6">{user.nickname}</BoldTypography>
                            {isAdmin && (
                                <>
                                    <SecondaryButton
                                        component={Link}
                                        to="/admin-panel"
                                        onClick={handleMenuToggle}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    >
                                        Панель адміністратора
                                    </SecondaryButton>
                                </>
                            )}
                            <LogoutButton onClick={handleMenuToggle} fullWidth />
                        </>
                    ) : (
                        <>
                            <LoginButton onClick={handleMenuToggle} fullWidth sx={{ mb: 2 }} />
                            <RegisterButton onClick={handleMenuToggle} fullWidth />
                        </>
                    )}
                </Box>
            </Drawer>
        );
    };

    const drawer = (
        <div>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemText primary="Головна" />
                    </ListItemButton>
                </ListItem>
                {isAuth && isAdmin && (
                    <>
                        <ListItem>
                            <ListItemButton onClick={() => navigate("/admin-panel")}>
                                <ListItemText primary="Панель адміністратора" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
            <Divider />
        </div>
    );

    return (<header>
        {!(isMobile && mobileMenuOpen) && (
            <AppBar position="absolute" sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                color: 'white.main',
                boxShadow: 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}>
                <Toolbar sx={{
                    justifyContent: "space-between",
                    px: { xs: 2, sm: 3, md: 4 },
                    height: { xs: '24px', md: 'auto' },
                    minHeight: { xs: '24px', md: 'auto' },
                    py: { xs: 0, md: 1 }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LogoAvatar sx={{ mr: { xs: 1, sm: 2 } }} />
                        <LogoTypography mr={3} />
                    </Box>

                    {isMobile ? (
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuToggle}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {isAuth ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    {isAdmin && (
                                        <Box sx={{ mr: 1 }}>
                                            <Chip label="Адмін" color="warning" size="small" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} />
                                        </Box>
                                    )}
                                    <BoldTypography color="inherit">{user.nickname}</BoldTypography>
                                </Box>
                            ) :
                                <LoginButton mr={2}></LoginButton>}
                            {isAuth ? (
                                <>
                                    {isAdmin && (
                                        <>
                                            <SecondaryButton component={Link} to="/admin-panel" sx={{ mr: 1 }}>
                                                Панель адміністратора
                                            </SecondaryButton>
                                        </>
                                    )}
                                    <LogoutButton></LogoutButton>
                                </>
                            ) : <RegisterButton></RegisterButton>}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        )}
        {isMobile && <MobileDrawer />}
    </header>)
}

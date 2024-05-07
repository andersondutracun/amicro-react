import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import logoImage from '../images/logo.png';
import { sidebarNavItems } from './SidebarNavItems';

const AdminSidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleItemClick = (index) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [index]: !prevOpenItems[index], // Alternar o estado do item clicado
        }));
    };

    const renderNavItems = (items) => {
        return items.map((item, index) => (
            <div key={index}>
                {item.subItems ? (
                    <>
                        <ListItem button onClick={() => handleItemClick(index)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.display} />
                            {openItems[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <List component="div" disablePadding style={{ display: openItems[index] ? 'block' : 'none' }}>
                            {item.subItems.map((subItem, subIndex) => (
                                <ListItem key={subIndex} button component={Link} to={subItem.to} style={{ paddingLeft: 32 }} onClick={handleDrawerToggle}>
                                    <ListItemIcon>
                                        {subItem.icon || <InboxIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={subItem.display} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                ) : (
                    <ListItem button component={Link} to={item.to} onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.display} />
                    </ListItem>
                )}
            </div>
        ));
    };

    return (
        <>
            {/* Ícone de menu hamburguer para dispositivos móveis */}
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                    display: { md: 'none' },
                    position: 'fixed',
                    top: 0,
                    left: '10px',
                }}
            >
                <MenuIcon />
            </IconButton>

            {/* Drawer para dispositivos móveis */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <List>
                    {renderNavItems(sidebarNavItems)}
                </List>
            </Drawer>

            {/* Drawer para dispositivos maiores (desktop) */}
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                    },
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Logo */}
                    <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                        <img src={logoImage} alt="Logo" style={{ width: '100%', maxWidth: '200px', marginRight: '16px' }} />
                    </div>
                    
                    {/* Menu para dispositivos maiores */}
                    <List>
                        {renderNavItems(sidebarNavItems)}
                    </List>

                    {/* Rodapé */}
                    <div style={{ borderTop: '1px solid #555', marginTop: 'auto', padding: '16px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#000' }}>AMICRO | CURITIBA</span>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default AdminSidebar;
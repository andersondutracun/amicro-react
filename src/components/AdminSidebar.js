import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { sidebarNavItems } from './SidebarNavItems';
import logoImage from '../images/logo.png';


const AdminSidebar = () => {
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();
    const [openItemIndex, setOpenItemIndex] = useState(-1);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Atualizar seção ativa com base na localização atual
    useEffect(() => {
        const currentPath = location.pathname;
        const section = sidebarNavItems.find(item => currentPath.startsWith(item.to))?.section || '';
        setActiveSection(section);
    }, [location]);

    const handleItemClick = (index) => {
        setOpenItemIndex(openItemIndex === index ? -1 : index);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const renderNavItems = (items) => {
        return items.map((item, index) => (
            <div key={index}>
                {item.subItems ? (
                    <ListItem button onClick={() => handleItemClick(index)}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        {mobileOpen ? null : (
                            <ListItemText primary={item.display} />
                        )}
                        {item.subItems && (openItemIndex === index ? <ExpandLess /> : <ExpandMore />)}
                    </ListItem>
                ) : (
                    <ListItem button component={Link} to={item.to} onClick={handleDrawerToggle}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        {mobileOpen ? null : (
                            <ListItemText primary={item.display} />
                        )}
                    </ListItem>
                )}
                {item.subItems && (
                    <Collapse in={openItemIndex === index} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.subItems.map((subItem, subIndex) => (
                                <ListItem key={subIndex} button component={Link} to={subItem.to} style={{ paddingLeft: 32 }} onClick={handleDrawerToggle}>
                                    <ListItemIcon>
                                        {subItem.icon || <InboxIcon />} {/* Use subItem.icon se estiver definido */}
                                    </ListItemIcon>
                                    {mobileOpen ? null : (
                                        <ListItemText primary={subItem.display} />
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </div>
        ));
    };
    

    return (
        <>
            {/* IconButton para exibir o menu em dispositivos móveis */}
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
            {/* Drawer para dispositivos maiores e menu expandido em dispositivos móveis */}
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
                    display: { xs: 'block', md: 'none' }, // Exibição apenas em dispositivos móveis
                }}
                open={mobileOpen}
                onClose={handleDrawerToggle}
            >
                <List>
                    {renderNavItems(sidebarNavItems)}
                </List>
            </Drawer>
            {/* Drawer para dispositivos maiores */}
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
                    display: { xs: 'none', md: 'block' }, // Exibição apenas em dispositivos maiores
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                        <img src={logoImage} alt="Logo" style={{ width: '100%', maxWidth: '200px', marginRight: '16px' }} />
                    </div>
                    <List style={{ flexGrow: 1 }}>
                        {renderNavItems(sidebarNavItems)}
                    </List>
                    <div style={{ borderTop: '1px solid #555', padding: '16px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#000' }}>AMICRO | CURITIBA</span>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default AdminSidebar;

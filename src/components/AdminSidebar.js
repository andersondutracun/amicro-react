import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { sidebarNavItems } from './SidebarNavItems';
import logoImage from '../images/logo.png';

const AdminSidebar = () => {
    const [activeSection, setActiveSection] = useState('');
    const location = useLocation();
    const [openItemIndex, setOpenItemIndex] = useState(-1);

    // Atualizar seção ativa com base na localização atual
    useEffect(() => {
        const currentPath = location.pathname;
        const section = sidebarNavItems.find(item => currentPath.startsWith(item.to))?.section || '';
        setActiveSection(section);
    }, [location]);

    const handleItemClick = (index) => {
        setOpenItemIndex(openItemIndex === index ? -1 : index);
    };

    const renderNavItems = (items) => {
        return items.map((item, index) => (
            <div key={index}>
                <ListItem button onClick={() => handleItemClick(index)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.display} />
                    {item.subItems && (openItemIndex === index ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {item.subItems && (
                    <Collapse in={openItemIndex === index} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.subItems.map((subItem, subIndex) => (
                                <ListItem key={subIndex} button component={Link} to={subItem.to} style={{ paddingLeft: 32 }}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={subItem.display} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </div>
        ));
    };

    return (
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
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                <img src={logoImage} alt="Logo" style={{ width: '100%', maxWidth: '200px', marginRight: '16px' }} />
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Animate</span>
            </div>
            <List>
                {renderNavItems(sidebarNavItems)}
            </List>
        </Drawer>
    );
};

export default AdminSidebar;

import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';

const sidebarNavItems = [
    {
        display: 'Dashboard',
        icon: <DashboardIcon/>,
        to: '/admin/index',
        section: ''
    },
    {
        display: 'Postagem',
        icon: <PostAddIcon/>,
        to: '/admin/createpost',
        section: 'started',
        subItems: [
            {
                display: 'Listar Postagens',
                to: '/admin/postlist'
            },
            {
                display: 'Postar Noticia',
                to: 'admin/createpost/createnewsletter'
            },
            {
                display: 'Postar Material',
                to: 'admin/createpost/creatematerials'
            },            
        ]
    },
    {
        display: 'Usuários',
        icon: <GroupIcon/>,
        to: '/admin/createpost',
        section: 'started',
        subItems: [
            {
                display: 'Listar Usuários',
                to: '/admin/users'
            },
            {
                display: 'Criar Usuário',
                to: '/admin/createuser'
            }
        ]
    },
    {
        display: 'Financeiro',
        icon: <AccountBalanceIcon/>,
        to: '/admin/billing',
        section: 'started',
        subItems: [
            {
                display: 'Totais',
                icon: <AccountBalanceIcon/>,
                to: '/admin/billing/totals'
            },
            {
                display: 'Contas a Pagar e Receber',
                icon: <AccountBalanceIcon/>,
                to: '/admin/billing/bills'
            },
            {
                display: 'Relatórios',
                icon: <AccountBalanceIcon/>,
                to: '/admin/billing/logs'
            },
        ]
    },
    {
        display: 'Configurações',
        icon: <SettingsIcon/>,
        to: '/admin/config',
        section: ''
    },
    // Mais itens do menu...
];

export { sidebarNavItems }; // Exportação padrão

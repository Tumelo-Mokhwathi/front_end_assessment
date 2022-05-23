import { NavItem } from './nav-item';

export let menu: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: 'dashboard'
  },
  {
    displayName: 'User',
    iconName: 'face',
    route: 'Users_',
    children: [
      {
        displayName: 'Users',
        iconName: 'account_box',
        route: 'users/users'
      },
      {
        displayName: 'Companies',
        iconName: 'account_box',
        route: 'users/companies'
      }
    ]
  }
];

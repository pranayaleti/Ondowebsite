import BaseLayout from '../../components/BaseLayout';
import { 
  LayoutDashboard, 
  CreditCard, 
  Megaphone, 
  FolderOpen, 
  FileText, 
  MessageSquare,
  Bell
} from 'lucide-react';

const PortalLayout = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/dashboard/assets', label: 'Assets', icon: FolderOpen },
    { path: '/dashboard/invoices', label: 'Invoices', icon: FileText },
    { path: '/dashboard/tickets', label: 'Tickets', icon: MessageSquare },
    { path: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ];

  return <BaseLayout title="Dashboard" navItems={navItems} />;
};

export default PortalLayout;


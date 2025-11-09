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
    { path: '/portal', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/portal/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/portal/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/portal/assets', label: 'Assets', icon: FolderOpen },
    { path: '/portal/invoices', label: 'Invoices', icon: FileText },
    { path: '/portal/tickets', label: 'Tickets', icon: MessageSquare },
    { path: '/portal/notifications', label: 'Notifications', icon: Bell },
  ];

  return <BaseLayout title="Portal" navItems={navItems} />;
};

export default PortalLayout;


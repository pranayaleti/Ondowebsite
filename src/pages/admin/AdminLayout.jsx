import BaseLayout from '../../components/BaseLayout';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  BarChart3,
  MessageSquare,
  FileText,
  Folder,
  Bell,
  Bot,
  Mail
} from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/clients', label: 'Clients', icon: Users },
    { path: '/admin/consultation-leads', label: 'Consultation Leads', icon: MessageSquare },
    { path: '/admin/ai-conversations', label: 'AI Conversations', icon: Bot },
    { path: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/admin/email-templates', label: 'Email Templates', icon: Mail },
    { path: '/admin/assets', label: 'Assets', icon: Folder },
    { path: '/admin/tickets', label: 'Tickets', icon: MessageSquare },
    { path: '/admin/invoices', label: 'Invoices', icon: FileText },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  ];

  return <BaseLayout title="Admin Panel" navItems={navItems} />;
};

export default AdminLayout;


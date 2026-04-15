import ProfileMenu from '@/components/ProfileMenu';
import { firstName } from '@/lib/dateUtils';
import { dashboardHeaderStyles as s } from './DashboardHeader.styles';

interface Props {
  name?:  string | null;
  email?: string | null;
  image?: string | null;
}

export default function DashboardHeader({ name, email, image }: Props) {
  return (
    <header style={s.header}>
      <div>
        <p style={s.greeting}>Welcome back,</p>
        <p style={s.name}>{firstName(name)} 👋</p>
      </div>
      <ProfileMenu name={name} email={email} image={image} />
    </header>
  );
}

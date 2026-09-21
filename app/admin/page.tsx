import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

export default function AdminIndexPage() {
  redirect(ROUTES.USERS);
}

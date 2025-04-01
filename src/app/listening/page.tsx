import { redirect } from 'next/navigation';

export default function RedirectPage() {
  redirect('/dashboard/listening');
  return null;
}

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-[#8B4513]">Caricamento...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
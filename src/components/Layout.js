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

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-amber-50">
      <div className="flex-1 relative">
        <main className="w-full h-full overflow-y-auto webkit-overflow-scrolling-touch">
          {children}
        </main>
      </div>
    </div>
  );
}
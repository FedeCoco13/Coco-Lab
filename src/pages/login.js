import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Credenziali non valide. Riprova.');
        console.error('Errore login:', result.error);
      } else {
        console.log('Login riuscito, reindirizzamento...');
        router.replace('/');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setError('Si è verificato un errore durante il login.');
    } finally {
      setIsLoading(false);
    }
  };

  if (session) return null;

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#8B4513] text-center mb-6">
          COCO LAB Login
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8B4513]"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B4513] text-white py-2 px-4 rounded-lg hover:bg-[#A0522D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
import React from 'react';
import { ShoppingCart, Calendar, Book, FileText, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Logo = () => (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 201 211"
      enableBackground="new 0 0 201 211"
      className="h-10 md:h-12 w-10 md:w-12"
    >
      <path
        fill="none"
        opacity="1.000000"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.000000"
        d="M40.000000,53.500000 C38.339321,58.362560 35.554012,62.157730 30.519535,64.051918 C29.222885,64.539780 28.051315,65.545479 27.023026,66.524185 C24.569162,68.859741 23.707071,70.965111 25.863884,74.581184 C33.217438,86.910027 39.053276,99.966667 42.516758,113.995865 C45.242840,125.038139 47.374023,136.180374 48.456463,147.504166 C48.631161,149.331802 48.990784,150.986099 50.000000,152.500000"
      />
      <path
        fill="none"
        opacity="1.000000"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9.000000"
        d="M145.750000,175.000000 C144.036728,170.090042 139.271103,170.250687 135.481201,169.059814 C125.235115,165.840271 114.735275,164.024796 104.015366,162.858734 C87.702866,161.084366 71.702972,161.646805 56.023994,166.576324 C51.721104,167.929184 46.537605,169.037613 47.000000,175.500000 C46.500000,175.500000 46.000000,175.500000 45.500000,175.500000"
      />
      <path
        fill="none"
        opacity="1.000000"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9.000000"
        d="M149.500000,165.500000 C148.832855,157.667023 146.044800,151.880188 137.537460,149.372894 C121.947472,144.778198 106.555885,139.834671 89.999588,139.919113 C74.960945,139.995834 62.354149,145.736359 51.026970,155.032867 C50.319542,155.613449 50.000000,156.666672 49.500000,157.500000"
      />
    </svg>
  

);

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="min-h-screen bg-amber-50">
        {/* Header Responsive */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
              <div className="flex items-center gap-3">
                <Logo />
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#8B4513]">COCO LAB</h1>
                  <p className="text-sm text-[#A0522D]">Gestionale Laboratorio</p>
                </div>
              </div>
              {session && (
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <span className="text-[#8B4513] text-sm md:text-base text-center">
                    {session.user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full md:w-auto px-4 py-2 text-[#8B4513] hover:bg-amber-50 rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Esci
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Responsive */}
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Menu Cards */}
            <Link 
              href="/orders" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <ShoppingCart className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Nuovo Ordine</h2>
            </Link>

            <Link 
              href="/agenda" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Agenda Ordini</h2>
            </Link>

            <Link 
              href="/recipes" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <Book className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Ricette</h2>
            </Link>

            <Link 
              href="/invoices" 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100 text-center flex flex-col items-center"
            >
              <FileText className="h-10 w-10 md:h-12 md:w-12 text-[#8B4513] mb-3 md:mb-4" />
              <h2 className="text-lg md:text-xl font-bold text-[#8B4513]">Fatture</h2>
            </Link>
          </div>
        </main>

        {/* Footer Responsive */}
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <p className="text-center text-sm md:text-base text-[#A0522D]">
              © 2024 COCO LAB - Gestionale Laboratorio
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
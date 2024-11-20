import React from 'react';
import { ShoppingCart, Calendar, Book, FileText, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Logo = () => (
  <svg 
  xmlns="http://www.w3.org/2000/svg"
  width="50"
  height="48"
  viewBox="0 0 331 321"
>
  <g transform="translate(0,321) scale(0.1,-0.1)" fill="currentColor" stroke="none">
    <path d="M1060 3139 c-140 -11 -261 -21 -268 -24 -7 -3 -20 -22 -29 -42 -27 -67 -49 -87 -207 -198 l-155 -108 -10 -51 c-6 -28 -12 -73 -13 -100 l-3 -49 -135 -94 c-74 -52 -138 -100 -142 -107 -4 -7 -11 -40 -17 -75 l-10 -62 90 -157 c178 -308 237 -455 318 -782 40 -163 64 -331 76 -540 7 -120 19 -160 46 -160 10 0 66 36 123 79 57 44 137 95 178 115 327 156 752 135 1287 -65 271 -102 295 -120 310 -241 l7 -63 10 70 c13 100 10 205 -7 239 -21 43 -52 62 -174 108 -440 163 -697 217 -975 205 -264 -12 -442 -79 -649 -246 -35 -28 -71 -51 -81 -51 -29 0 -39 45 -55 245 -18 221 -34 322 -76 495 -66 269 -142 457 -278 694 -35 60 -59 111 -54 115 143 98 232 164 237 178 4 10 10 47 13 82 l6 64 20 -24 c32 -39 65 -113 132 -288 115 -305 192 -575 266 -940 l33 -163 13 43 c18 61 17 65 -23 264 -43 215 -100 450 -149 609 -46 151 -147 430 -187 519 -17 37 -29 69 -27 70 2 2 36 25 74 52 97 67 129 98 155 156 13 27 27 49 30 49 11 0 86 -193 142 -364 87 -265 158 -576 213 -931 14 -93 27 -175 30 -182 4 -11 75 -36 82 -29 11 11 -66 458 -117 677 -67 289 -185 651 -261 800 -10 21 -17 39 -15 39 2 0 127 9 276 20 150 11 275 18 280 15 4 -2 5 -35 3 -72 -5 -69 92 -1403 105 -1458 8 -28 9 -26 25 35 16 63 15 80 -33 703 -28 351 -50 651 -50 667 l0 28 63 -15 c58 -13 132 -29 334 -69 46 -9 90 -22 99 -28 15 -11 12 -63 -35 -643 l-52 -630 24 -64 24 -64 6 40 c4 22 27 301 52 620 25 319 49 592 53 606 l7 27 169 -97 c94 -54 172 -103 174 -109 2 -6 -13 -68 -32 -139 -61 -222 -186 -795 -186 -853 0 -12 11 -35 25 -51 24 -30 24 -30 29 -7 3 13 22 104 42 203 44 222 104 481 145 631 l31 113 47 -27 c156 -91 181 -109 192 -134 14 -35 13 -42 -75 -369 -80 -293 -121 -420 -167 -511 -29 -57 -29 -57 -8 -68 25 -14 20 -17 52 45 48 97 120 333 227 753 12 47 11 46 60 32 26 -7 52 -29 95 -82 79 -95 84 -104 85 -164 0 -80 -59 -208 -181 -390 -47 -70 -47 -70 -20 -66 21 3 40 24 93 105 60 93 129 214 139 246 3 8 31 -5 82 -39 50 -33 75 -55 70 -63 -4 -7 -104 -127 -222 -267 l-216 -255 -5 -62 c-3 -35 -5 -63 -4 -63 2 0 177 206 326 384 l117 139 30 126 c17 70 31 133 31 141 0 8 -36 40 -80 70 -137 94 -127 82 -132 153 -4 62 -5 65 -77 150 -60 72 -79 88 -109 93 -56 10 -72 22 -73 52 -1 69 -19 89 -144 165 -116 71 -120 75 -133 120 -8 28 -22 53 -35 61 -12 7 -104 59 -204 116 -165 92 -183 105 -183 129 0 14 -4 31 -8 37 -4 5 -122 36 -262 68 -140 31 -266 61 -279 67 -21 9 -23 15 -18 49 l5 40 -56 -1 c-32 -1 -172 -10 -312 -20z"/>
    <path d="M1126 610 c-122 -14 -230 -38 -360 -81 -132 -43 -176 -66 -210 -112 -26 -35 -49 -146 -39 -187 15 -64 80 -114 216 -165 l66 -24 11 57 c7 31 14 66 16 77 4 17 -5 24 -58 43 -79 28 -183 84 -183 97 0 18 276 102 405 124 393 67 906 9 1353 -153 72 -26 124 -41 128 -35 7 12 31 140 27 144 -12 8 -240 87 -313 108 -269 78 -465 107 -755 112 -124 2 -261 0 -304 -5z"/>
  </g>
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
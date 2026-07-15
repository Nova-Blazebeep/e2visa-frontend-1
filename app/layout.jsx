'use client';

import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { Inter } from 'next/font/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <ToastContainer toastClassName="custom-toast" />
      </body>
    </html>
  );
} 
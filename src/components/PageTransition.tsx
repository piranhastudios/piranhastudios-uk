import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function PageTransition({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-red-600 z-50"
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-black z-50"
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/path-to-your-logo.png"
          alt="Piranha Studios Logo"
          width={100}
          height={100}
        />
      </motion.div>
      {children}
    </>
  );
};
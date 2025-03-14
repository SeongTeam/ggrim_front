'use client'
import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <LoaderCircle className="h-16 w-16 text-gray-300" />
        </motion.div>
        <p className="text-lg text-gray-300">Loading...</p>
      </motion.div>
    </div>
  );
}

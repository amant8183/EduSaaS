import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
            />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-text-secondary text-sm font-medium"
            >
                Loading...
            </motion.p>
        </div>
    );
}

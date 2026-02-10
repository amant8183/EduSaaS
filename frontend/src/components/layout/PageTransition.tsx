import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

import { motion } from "framer-motion";

export default function ThreadClosed() {
  return (
    <motion.div
      className="thread-closed"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="thread-closed-divider"></div>
      <span>Thread was closed</span>
    </motion.div>
  );
}

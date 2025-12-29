import { motion } from "motion/react";

import { Link } from "@tanstack/react-router";

import { MarvIcon } from "@/components/global/marv-icon";

const MotionLink = motion.create(Link);

export const AppLogo = () => {
  return (
    <MotionLink
      to="/"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      viewTransition={true}
      className="flex size-fit items-center mx-auto justify-center text-lg font-bold"
    >
      <MarvIcon className="h-7 w-auto" />
      Chat
    </MotionLink>
  );
};

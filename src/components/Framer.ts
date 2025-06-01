import { Variants } from "framer-motion";

export const list = {
	initial: {
		opacity: 0,
		transition: {
			when: "afterChildren",
		},
	},
	animate: {
		opacity: 1,
		transition: {
			when: "beforeChildren",
			staggerChildren: 0.3,
		},
	},
};

export const listItemAnimation: Variants = {
	initial: {
		opacity: 0,
		y: 20,
		scale: 0.95,
		transition: {
			when: "afterChildren",
		},
	},
	animate: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			when: "beforeChildren",
			staggerChildren: 0.3,
			type: "spring",
			stiffness: 500,
			damping: 30,
			mass: 0.8,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.15,
		},
	},
};

export const newUnreadMessageAnimation: Variants = {
	initial: {
		opacity: 0,
		scale: 0.5,
		y: 50,
		transition: {
			when: "afterChildren",
		},
	},
	animate: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			when: "beforeChildren",
			staggerChildren: 0.3,
			type: "spring",
			stiffness: 500,
			damping: 30,
			mass: 0.8,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.15,
		},
	},
};

export const fadeAnimation: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

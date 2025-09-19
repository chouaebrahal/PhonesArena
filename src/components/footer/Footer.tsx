
import React from "react";

const Footer = () => {
	return (
		<footer className="w-full bg-[var(--bg-alt)] text-white py-6 mt-12">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
				<div className="mb-4 md:mb-0 text-center md:text-left">
					<span className="font-bold text-lg">NextJS WP GraphQL</span>
					<span className="block text-sm opacity-70">&copy; {new Date().getFullYear()} All rights reserved.</span>
				</div>
				<div className="flex gap-6">
					<a href="/privacy" className="transition-colors duration-300 hover:text-blue-300">Privacy Policy</a>
					<a href="/terms" className="transition-colors duration-300 hover:text-blue-300">Terms of Service</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

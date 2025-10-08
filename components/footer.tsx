import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/Logo_2.png"
            alt="Wall of Shame"
            width={500}
            height={200}
            className="h-8 w-auto"
          />
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/donate"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Donate
            </Link>
          </div>
          <p className="text-sm text-white/60">
            © {currentYear} The Great Wall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

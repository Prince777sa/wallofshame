import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo_1.png"
                alt="Wall of Shame Logo"
                width={500}
                height={200}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/donate"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

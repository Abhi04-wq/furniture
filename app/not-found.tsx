import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <span className="font-nav text-xs uppercase tracking-widest text-secondary mb-3">
        404 — Not Found
      </span>
      <h1 className="font-heading text-4xl sm:text-5xl text-primary font-normal mb-4">
        Piece Not Found
      </h1>
      <p className="font-body text-sm text-primary/75 max-w-md mb-8 leading-relaxed">
        The architectural design or page you requested does not exist or has been relocated to our private archives.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-primary text-surface rounded-full font-nav text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
      >
        Return to Atelier
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-4 text-center">
      <div>
        <p className="text-gradient font-display text-8xl font-bold">404</p>
        <h1 className="font-display mt-4 text-2xl text-white">This page drifted into space.</h1>
        <Link
          href="/"
          className="bg-gradient-brand shadow-glow-sm mt-8 inline-flex rounded-full px-6 py-3 font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}

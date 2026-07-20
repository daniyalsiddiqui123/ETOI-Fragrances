import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-lg mx-auto px-6 text-center">
        <h1 className="font-serif text-6xl text-etoi-primary font-light mb-4">
          404
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  )
}

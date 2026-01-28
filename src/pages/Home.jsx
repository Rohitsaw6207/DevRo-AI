import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <section className="pt-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-4">
            Home
          </h1>
          <p className="text-neutral-400">
            Homepage placeholder. Content coming next.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

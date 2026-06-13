import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Travelling Together?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join the BusUndo community today and never travel alone again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
            Learn More
          </Button>
        </div>
        <p className="text-blue-100 mt-6">
          No credit card required • Free forever for students
        </p>
      </div>
    </section>
  )
}

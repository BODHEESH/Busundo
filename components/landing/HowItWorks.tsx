import { Search, Users, Bus, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search Your Route",
    description: "Enter your source and destination to find available bus routes."
  },
  {
    icon: Users,
    title: "Join or Create Group",
    description: "Join an existing travel group or create a new one for your journey."
  },
  {
    icon: Bus,
    title: "Coordinate Travel",
    description: "Update your status, chat with group members, and travel together."
  },
  {
    icon: CheckCircle,
    title: "Complete Journey",
    description: "Mark your journey complete and help others with community reports."
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start coordinating your bus travel in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 relative">
                    <Icon className="w-8 h-8" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

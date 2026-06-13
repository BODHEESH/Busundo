import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, Bell, Share2, MessageCircle, Star } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Travel Groups",
    description: "Create or join travel groups for your route. Know who else is travelling and coordinate together."
  },
  {
    icon: MapPin,
    title: "Route Discovery",
    description: "Find the best bus routes from your location. Get detailed stops and estimated travel time."
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Get notified when friends join your group or when travel status changes."
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your travel plans with friends via WhatsApp, Instagram, or any social platform."
  },
  {
    icon: MessageCircle,
    title: "Community Reports",
    description: "Know if buses are delayed, cancelled, or crowded through community updates."
  },
  {
    icon: Star,
    title: "Friend Coordination",
    description: "See when your friends are travelling and join the same bus together."
  }
]

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Busundo?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            More than just bus schedules. We help you travel together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2 hover:border-blue-600 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

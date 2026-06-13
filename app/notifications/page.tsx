import Link from "next/link";
import { Bell, Users, MapPin, Clock, CheckCheck } from "lucide-react";
import { TopNav } from "@/components/nav";

const mockNotifications = [
  {
    id: "n1",
    type: "group_joined",
    title: "Nikhil Raj joined your group",
    message: "Aluva → Kakkanad · 8:30 AM",
    time: "2 min ago",
    read: false,
    icon: Users,
  },
  {
    id: "n2",
    type: "status_update",
    title: "Sneha Pillai reached the stop",
    message: "Your group member updated their status",
    time: "15 min ago",
    read: false,
    icon: MapPin,
  },
  {
    id: "n3",
    type: "group_created",
    title: "New group on your route",
    message: "Aluva → Kakkanad · 9:00 AM · 2 spots left",
    time: "1 hour ago",
    read: true,
    icon: Bell,
  },
  {
    id: "n4",
    type: "reminder",
    title: "Your group departs soon",
    message: "Aluva → Kakkanad departs in 30 minutes",
    time: "2 hours ago",
    read: true,
    icon: Clock,
  },
];

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <TopNav back={{ href: "/dashboard", label: "Dashboard" }} />

      <section className="py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-ink/50">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="flex items-center gap-1.5 text-xs font-semibold text-transit hover:underline">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>
      </section>

      <section className="space-y-2">
        {mockNotifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Link
              key={notification.id}
              href="/dashboard"
              className={`flex items-start gap-3 rounded-xl2 border p-4 transition hover:border-transit ${
                notification.read
                  ? "border-line bg-white"
                  : "border-transit/30 bg-transit/5"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  notification.read ? "bg-paper" : "bg-transit/10"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    notification.read ? "text-ink/40" : "text-transit"
                  }`}
                />
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    notification.read ? "text-ink/70" : "text-ink"
                  }`}
                >
                  {notification.title}
                </p>
                <p className="mt-0.5 text-sm text-ink/50">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-ink/40">{notification.time}</p>
              </div>
              {!notification.read && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-transit" />
              )}
            </Link>
          );
        })}

        {mockNotifications.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-line p-12 text-center">
            <Bell className="mx-auto h-12 w-12 text-ink/20" />
            <p className="mt-4 font-display text-sm font-semibold text-ink/40">
              No notifications yet
            </p>
            <p className="mt-1 text-xs text-ink/30">
              We'll notify you when something happens
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

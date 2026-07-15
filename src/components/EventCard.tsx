import { formatDate } from "@/lib/utils";
import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  banner_url?: string | null;
  clubs: { name: string } | { name: string }[] | null;
  event_rsvps: { id: string; user_id: string }[] | null;
}

interface EventCardProps {
  event: Event;
  index: number;
  user: { id: string } | null;
  onRsvpToggle: (eventId: string, hasRsvpd: boolean) => void;
  isRsvpPending: boolean;
}

export function EventCard({ event, index, user, onRsvpToggle, isRsvpPending }: EventCardProps) {
  const club = Array.isArray(event.clubs) ? event.clubs[0] : event.clubs;
  const rsvps = Array.isArray(event.event_rsvps) ? event.event_rsvps : [];
  const hasRsvpd = user ? rsvps.some((r) => r.user_id === user.id) : false;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const resetForm = () => {
    setStudentId("");
    setDietaryPreference("");
    setIsFormOpen(false);
  };

  const handleRsvpClick = () => {
    if (!user) {
      toast.error("Please log in to RSVP");
      return;
    }

    if (hasRsvpd) {
      setConfirmOpen(true);
      return;
    }

    setIsFormOpen(true);
  };

  const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    const form = formEvent.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    onRsvpToggle(event.id, false);
    resetForm();
  };

  // Event visual themes: background gradients and icons
  const eventThemes = [
    {
      bg: "from-purple-600 to-purple-400",
      icon: "🚀",
      label: "Tech",
    },
    {
      bg: "from-blue-400 to-cyan-300",
      icon: "🎨",
      label: "Art",
    },
    {
      bg: "from-orange-400 to-pink-400",
      icon: "🎤",
      label: "Music",
    },
    {
      bg: "from-green-500 to-emerald-400",
      icon: "📚",
      label: "Learning",
    },
  ];

  const theme = eventThemes[index % eventThemes.length];

  return (
    <article className="group neu-border flex flex-col bg-white transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[8px_8px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000000]">
      {/* Image Header with Date Overlay */}
      <div
        className={`bg-gradient-to-br ${theme.bg} relative flex items-center justify-center overflow-hidden py-12`}
      >
        <div className="text-6xl opacity-30">{theme.icon}</div>
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-mono text-xs font-bold uppercase opacity-90">
            {event.event_date ? formatDate(event.event_date).split(" at ")[0].toUpperCase() : "TBA"}
          </p>
        </div>
        <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[10px] font-bold uppercase text-[#123a57]">
          Event
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col p-5">
        <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-black/80">
          {event.title}
        </h2>
        <p className="mt-1 font-mono text-xs">{club?.name}</p>
        {event.description ? <p className="mt-4 text-sm leading-6">{event.description}</p> : null}

        <div className="my-4 border-t-2 border-black" />

        <dl className="flex-grow space-y-1 font-mono text-xs">
          <div className="flex flex-col gap-0.5 border-b border-gray-100 pb-1.5">
            <dt className="font-bold uppercase text-gray-500">Date & Time</dt>
            <dd className="font-medium text-black">
              {event.event_date ? formatDate(event.event_date) : "TBA"}
            </dd>
          </div>
          <div className="flex justify-between pt-1.5">
            <dt className="font-bold uppercase">Venue</dt>
            <dd>{event.location || "TBA"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-bold uppercase text-[#123a57]">Attendees</dt>
            <dd className="font-bold">{rsvps.length} RSVP'd</dd>
          </div>
        </dl>

        {isFormOpen && !hasRsvpd ? (
          <form className="neu-border mt-5 bg-white p-4" onSubmit={handleSubmit} noValidate={false}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black">Complete your RSVP</h3>
                <p className="mt-1 text-sm">Required fields must be completed before submitting.</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="neu-border grid h-9 w-9 shrink-0 place-items-center bg-cream"
                aria-label="Close RSVP form"
              >
                <X aria-hidden="true" size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-xs font-bold uppercase">
                  Student ID{" "}
                  <span className="text-destructive ml-1" aria-hidden="true">
                    *
                  </span>
                </span>
                <input
                  type="text"
                  name="studentId"
                  value={studentId}
                  onChange={(inputEvent) => setStudentId(inputEvent.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                  autoComplete="off"
                  className="neu-border mt-2 w-full bg-cream px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your student ID"
                />
              </label>

              <label className="block">
                <span className="font-mono text-xs font-bold uppercase">
                  Dietary preference{" "}
                  <span className="text-destructive ml-1" aria-hidden="true">
                    *
                  </span>
                </span>
                <select
                  name="dietaryPreference"
                  value={dietaryPreference}
                  onChange={(selectEvent) => setDietaryPreference(selectEvent.target.value)}
                  required
                  className="neu-border mt-2 w-full bg-cream px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="none">No preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="halal">Halal</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isRsvpPending}
                className="neu-border bg-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-cream disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRsvpPending ? "Submitting..." : "Confirm RSVP"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="neu-border bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {!isFormOpen || hasRsvpd ? (
          <button
            type="button"
            onClick={handleRsvpClick}
            disabled={isRsvpPending}
            className={`neu-border mt-5 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
              hasRsvpd ? "bg-[#f5c66b] text-[#123a57]" : "bg-[#123a57] text-white"
            }`}
          >
            {isRsvpPending ? "Updating..." : hasRsvpd ? "RSVP'd ✓" : "RSVP →"}
          </button>
        ) : null}

        <div className="mt-4 flex gap-2 flex-wrap">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="neu-border px-3 py-2 font-mono text-xs font-bold uppercase hover:bg-[#1DA1F2] hover:text-white transition-colors"
          >
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="neu-border px-3 py-2 font-mono text-xs font-bold uppercase hover:bg-[#0A66C2] hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out this event: ${event.title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="neu-border px-3 py-2 font-mono text-xs font-bold uppercase hover:bg-[#25D366] hover:text-white transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

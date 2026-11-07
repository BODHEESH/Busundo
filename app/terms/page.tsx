import PageWrapper from "@/components/shared/PageWrapper";

// DRAFT: have a lawyer review this page before public launch, then remove this note.
export default function TermsPage() {
  return (
    <PageWrapper currentPage="terms" title="Terms of Service" description="The rules for using Busundo">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6 text-gray-700">
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Draft. These terms will be reviewed before launch.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Bus information</h2>
          <p>Busundo shows bus routes, stops, and departure times that are submitted by users and reviewed by our team. Timings change, and we cannot guarantee that a bus will run at the time shown. Please check with the bus crew or operator before you travel.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Contributions</h2>
          <p>By submitting a route, stop, or timing, you confirm that it is accurate to the best of your knowledge and that you have the right to share it. We may edit or reject submissions, and we may remove points that were awarded for a submission that proves to be inaccurate or fraudulent.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Accounts</h2>
          <p>You are responsible for activity on your account. Do not share sign-in codes or attempt to access other people&apos;s accounts.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Points</h2>
          <p>Points are a display score for contributions. They have no cash value and cannot be exchanged for money at this time.</p>
        </section>
      </div>
    </PageWrapper>
  );
}

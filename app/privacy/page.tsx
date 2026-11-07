import PageWrapper from "@/components/shared/PageWrapper";

// DRAFT: have a lawyer review this page before public launch, then remove this note.
export default function PrivacyPage() {
  return (
    <PageWrapper currentPage="privacy" title="Privacy Policy" description="How Busundo handles your information">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6 text-gray-700">
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Draft. This policy will be reviewed before launch.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your email address, used to sign in and to send one-time codes.</li>
            <li>Your name, taken from your email address or your Google profile.</li>
            <li>Routes, stops, and timings that you submit, and the points they earn.</li>
            <li>Basic usage information needed to keep the service working and secure.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">How we use it</h2>
          <p>We use your information to run your account, review contributions, award points, and keep Busundo secure. We do not sell your personal information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Public information</h2>
          <p>Approved routes, stops, and timings are public. Your name is not shown next to your contributions unless you choose to show it.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Deleting your data</h2>
          <p>You can ask us to delete your account and personal information. Contact details will be published here before launch.</p>
        </section>
      </div>
    </PageWrapper>
  );
}

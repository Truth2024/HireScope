export default function TermsOfService() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-indigo-600">
        Terms of Service
      </h1>

      <p className="mb-6 text-lg leading-relaxed">
        Welcome to <strong>HireScope</strong>! By accessing or using our platform, you agree to
        these Terms of Service. Please read them carefully to understand your rights and
        responsibilities.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">1. Use of the Platform</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>HireScope is designed to efficiently connect candidates and recruiters.</li>
        <li>
          You may use the platform only for lawful purposes and in accordance with these Terms.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">2. Accounts</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>Users are responsible for keeping their account credentials secure.</li>
        <li>Sharing your account or unauthorized access is strictly prohibited.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">3. User Content</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>You retain ownership of your content, including resumes, profiles, or posts.</li>
        <li>
          By using the platform, you grant HireScope permission to display and process your content
          to provide services.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">4. Prohibited Actions</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>No spamming, hacking, or other illegal activities are allowed.</li>
        <li>Do not attempt to disrupt or harm the platform or other users.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">5. Termination</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>HireScope may suspend or terminate accounts that violate these Terms.</li>
        <li>Termination does not affect obligations incurred prior to termination.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">6. Limitation of Liability</h2>
      <p className="mb-6 text-lg leading-relaxed">
        HireScope is provided as is and is not liable for indirect or consequential damages arising
        from the use of the platform.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">7. Changes to Terms</h2>
      <p className="mb-6 text-lg leading-relaxed">
        We may update these Terms at any time. Continued use of the platform constitutes acceptance
        of any changes.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">Contact</h2>
      <p className="mb-6 text-lg leading-relaxed">
        If you have any questions regarding these Terms, contact us: <br />
        Email:{' '}
        <a
          href="mailto:support@hirescope.com"
          className="text-indigo-600 underline hover:text-indigo-800"
        >
          support@hirescope.com
        </a>{' '}
        <br />
        Phone:{' '}
        <a href="tel:+18001234567" className="text-indigo-600 underline hover:text-indigo-800">
          +1 (800) 123-4567
        </a>{' '}
        <br />
        Address: 123 Tech Street, San Francisco, CA, USA
      </p>

      <p className="text-center text-gray-500 mt-12 text-sm">© 2026 HireScope</p>
    </section>
  );
}

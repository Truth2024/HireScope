export default function PrivacyPolicy() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-indigo-600">Privacy Policy</h1>

      <p className="mb-6 text-lg leading-relaxed">
        This Privacy Policy explains how <strong>HireScope</strong> collects, uses, and protects
        your personal data, as well as your rights when using our platform.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">1. Data Collection</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>
          We collect only the data necessary to provide our services: name, email, phone number,
          resume information, and other details you provide voluntarily.
        </li>
        <li>
          Data may be provided when registering, applying for jobs, or subscribing to newsletters.
        </li>
        <li>
          All data is used solely to provide services, connect candidates with recruiters, and send
          platform updates.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        2. Purpose of Data Processing
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>Connecting candidates with recruiters efficiently.</li>
        <li>Providing analytics and insights to improve the hiring process.</li>
        <li>Sending platform updates, newsletters, or promotions (only with user consent).</li>
        <li>Compliance with applicable laws.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        3. Data Handling and Storage
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>All personal data is stored securely and only retained as long as necessary.</li>
        <li>
          We do not share personal data with third parties except where required by law or to
          provide services (e.g., recruiters or payment processors).
        </li>
        <li>Data retention periods are defined by internal policies and applicable law.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">4. User Rights</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        <li>Users can access, correct, or request deletion of their personal data.</li>
        <li>
          Users may unsubscribe from communications at any time by contacting{' '}
          <a
            href="mailto:support@hirescope.com"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            support@hirescope.com
          </a>
          .
        </li>
        <li>
          Users can contact regulatory authorities if they believe their data rights are violated.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">5. Data Security</h2>
      <p className="mb-6 text-lg leading-relaxed">
        HireScope uses modern security measures, including encryption, secure data transfer
        protocols, and internal access controls, to protect your personal data.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        6. Changes to Privacy Policy
      </h2>
      <p className="mb-6 text-lg leading-relaxed">
        We may update this Privacy Policy from time to time. The latest version will be posted on
        the platform, and continued use constitutes acceptance of changes.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">Contact</h2>
      <p className="mb-6 text-lg leading-relaxed">
        For questions about this Privacy Policy or data processing, contact us: <br />
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

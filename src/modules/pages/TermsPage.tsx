import React from 'react'

export const TermsPage: React.FC = () => {
  return (
    <div className="container-responsive py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-zobda-gray">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              By accessing and using Zobda ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Zobda is a price tracking service that monitors Amazon product prices and provides historical data, price alerts, and deal discovery features. Our service is designed to help users make informed purchasing decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              To access certain features of the Service, you may be required to create an account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You may not use the Service in any manner that could damage, disable, overburden, or impair any server, or the network(s) connected to any server.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Prohibited activities include but are not limited to:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Attempting to gain unauthorized access to any part of the Service</li>
              <li>Using automated systems to access the Service without permission</li>
              <li>Interfering with or disrupting the Service or servers</li>
              <li>Transmitting any harmful or malicious code</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data and Privacy</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We collect and process data in accordance with our Privacy Policy. By using the Service, you consent to the collection and use of information as described in our Privacy Policy.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Collect and store price data from public sources</li>
              <li>Use aggregated, anonymized data for service improvement</li>
              <li>Share data with third-party partners as necessary for service operation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Zobda and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              You may not:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our trademarks or logos without written consent</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimers</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, Zobda excludes all representations, warranties, conditions and terms relating to our Service and the use of this Service.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Accuracy of price data or information</li>
              <li>Availability of products on Amazon</li>
              <li>Uninterrupted access to the Service</li>
              <li>Error-free operation of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              In no event shall Zobda, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              You may terminate your account at any time by contacting us or using the account deletion feature in your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              These Terms shall be interpreted and governed by the laws of the Kingdom of Saudi Arabia, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-zobda-lightGray rounded-lg p-6">
              <p className="text-zobda-gray mb-2"><strong>Email:</strong> legal@zobda.com</p>
              <p className="text-zobda-gray mb-2"><strong>Address:</strong> Riyadh, Kingdom of Saudi Arabia</p>
              <p className="text-zobda-gray"><strong>Phone:</strong> +966 XX XXX XXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

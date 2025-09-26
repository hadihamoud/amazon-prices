import React from 'react'

export const PrivacyPage: React.FC = () => {
  return (
    <div className="container-responsive py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-zobda-gray">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              At Zobda, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our price tracking service.
            </p>
            <p className="text-zobda-gray leading-relaxed mb-4">
              By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-6 space-y-2">
              <li>Create an account (name, email address, phone number)</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We automatically collect certain information when you use our Service:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-6 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage patterns and preferences</li>
              <li>Pages visited and features used</li>
              <li>Time and date of visits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Data</h3>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We collect and store data related to products you track:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-6 space-y-2">
              <li>Product URLs and ASINs</li>
              <li>Price history and trends</li>
              <li>Alert preferences and thresholds</li>
              <li>Watchlist items</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Provide and maintain our Service</li>
              <li>Process price tracking requests and send alerts</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and features</li>
              <li>Analyze usage patterns to enhance our Service</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We may share information with trusted third-party service providers who assist us in operating our Service, such as:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-6 space-y-2">
              <li>Cloud hosting providers</li>
              <li>Email service providers</li>
              <li>Analytics services</li>
              <li>Payment processors</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
            <p className="text-zobda-gray leading-relaxed mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="text-zobda-gray leading-relaxed mb-4">
              To exercise these rights, please contact us using the information provided in the Contact section.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our Service. Cookies are small data files stored on your device that help us:
            </p>
            <ul className="list-disc list-inside text-zobda-gray mb-4 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our Service</li>
              <li>Provide personalized content and features</li>
              <li>Improve our Service performance</li>
            </ul>
            <p className="text-zobda-gray leading-relaxed mb-4">
              You can control cookie settings through your browser preferences, but disabling cookies may affect the functionality of our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-zobda-gray leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-zobda-lightGray rounded-lg p-6">
              <p className="text-zobda-gray mb-2"><strong>Email:</strong> privacy@zobda.com</p>
              <p className="text-zobda-gray mb-2"><strong>Address:</strong> Riyadh, Kingdom of Saudi Arabia</p>
              <p className="text-zobda-gray"><strong>Phone:</strong> +966 XX XXX XXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

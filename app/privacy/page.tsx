import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>When you use Tube2Link, we collect:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>YouTube account information through Google OAuth</li>
            <li>Video metadata for videos you choose to process</li>
            <li>Generated content and analytics related to your videos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Process your YouTube videos and generate LinkedIn content</li>
            <li>Improve our service and user experience</li>
            <li>Communicate with you about your account and updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
          <p>We implement security measures to protect your information:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Secure HTTPS encryption for all data transfers</li>
            <li>Secure storage of OAuth tokens and user data</li>
            <li>Regular security audits and updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Google OAuth for authentication</li>
            <li>YouTube Data API for video processing</li>
            <li>OpenAI API for content generation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of communications</li>
            <li>Revoke OAuth permissions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
          <p>For privacy-related questions, contact us at:</p>
          <p className="mt-2">Email: info@spotcircuit.com</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Updates to This Policy</h2>
          <p>We may update this privacy policy. We will notify you of any changes by posting the new policy on this page.</p>
          <p className="mt-2">Last updated: February 11, 2024</p>
        </section>
      </div>
    </div>
  );
}

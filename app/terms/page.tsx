import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Tube2Link, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
          <p>Tube2Link provides a service that:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Converts YouTube video content into LinkedIn posts</li>
            <li>Processes video metadata and transcripts</li>
            <li>Generates AI-powered content summaries</li>
            <li>Facilitates content sharing on LinkedIn</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Provide accurate information when using the service</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use the service in compliance with YouTube and LinkedIn's terms of service</li>
            <li>Not misuse or attempt to manipulate the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
          <p>You retain rights to your content, but grant us permission to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Process and analyze your YouTube videos</li>
            <li>Generate derivative content for LinkedIn posts</li>
            <li>Store necessary data to provide the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Service Limitations</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>We do not guarantee 100% accuracy in AI-generated content</li>
            <li>Service availability may vary and maintenance may be required</li>
            <li>We reserve the right to modify or discontinue features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
          <p>The service is provided "as is" without warranties of any kind, either express or implied.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of new terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
          <p>For questions about these Terms, contact us at:</p>
          <p className="mt-2">Email: info@spotcircuit.com</p>
        </section>

        <section>
          <p className="mt-6 text-sm">Last updated: February 11, 2024</p>
        </section>
      </div>
    </div>
  );
}

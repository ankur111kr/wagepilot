import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | WagePilot',
  description: 'WagePilot privacy policy — how we collect, use, and protect your data.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 font-sora text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: January 1, 2025</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>1. Information We Collect</h2>
        <p>WagePilot collects minimal information to provide our services:</p>
        <ul>
          <li><strong>Calculator inputs</strong> — salary figures, state selections, and other inputs you enter are processed locally in your browser and are never stored on our servers.</li>
          <li><strong>Newsletter email</strong> — if you subscribe, we store your email address to send tax update newsletters.</li>
          <li><strong>Contact messages</strong> — name, email, and message content when you submit our contact form.</li>
          <li><strong>Analytics data</strong> — anonymized usage statistics via Google Analytics (page views, session duration, general location).</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and improve our calculator tools</li>
          <li>To send tax update newsletters (if subscribed)</li>
          <li>To respond to support enquiries</li>
          <li>To understand how users interact with our site (analytics)</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>We use cookies for:</p>
        <ul>
          <li><strong>Theme preference</strong> — remembering your dark/light mode choice</li>
          <li><strong>Analytics</strong> — Google Analytics sets cookies to track sessions anonymously</li>
          <li><strong>Advertising</strong> — Google AdSense may set cookies to serve relevant ads</li>
        </ul>
        <p>You can disable cookies in your browser settings. This may affect calculator functionality.</p>

        <h2>4. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Supabase</strong> — database for blog posts and newsletter subscribers</li>
          <li><strong>Google Analytics</strong> — anonymized website analytics</li>
          <li><strong>Google AdSense</strong> — non-intrusive advertising</li>
          <li><strong>Microsoft Clarity</strong> — anonymized session recordings to improve UX</li>
          <li><strong>Vercel</strong> — hosting and CDN</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>We retain newsletter email addresses until you unsubscribe. Contact messages are retained for 12 months. Analytics data is retained per Google's standard retention policies (14 months).</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@wagepilot.com.</p>

        <h2>7. Children's Privacy</h2>
        <p>WagePilot is not directed at children under 13. We do not knowingly collect information from children.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this policy periodically. Material changes will be announced on our homepage.</p>

        <h2>9. Contact</h2>
        <p>Questions about this policy? Email us at <a href="mailto:privacy@wagepilot.com">privacy@wagepilot.com</a>.</p>
      </div>
    </div>
  )
}

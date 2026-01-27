import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including name, email address, and any other information you choose to provide. We also automatically collect certain information about your device when you use our services.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to develop new features, to protect DevRo and our users, and to communicate with you about products, services, and promotional offers.',
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: 'We do not share your personal information with third parties except as described in this policy. We may share information in response to legal requests, to protect our rights and property, or with your consent.',
    },
    {
      title: '4. Data Security',
      content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable.',
    },
    {
      title: '5. Your Rights and Choices',
      content: 'You have the right to access, update, or delete your personal information at any time. You can also opt out of receiving promotional communications from us by following the instructions in those messages.',
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: 'We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings and other tools.',
    },
    {
      title: '7. Children\'s Privacy',
      content: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will delete that information.',
    },
    {
      title: '8. Changes to This Policy',
      content: 'We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, provide additional notice.',
    },
    {
      title: '9. Contact Us',
      content: 'If you have any questions about this privacy policy, please contact us at privacy@devro.ai or through our support channels.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" data-testid="privacy-policy-page">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Last updated: January 1, 2026
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              At DevRo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                data-testid={`policy-section-${index}`}
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Note:</strong> This is a sample privacy policy for demonstration purposes. In a production environment, you should consult with legal professionals to create a comprehensive privacy policy that complies with all applicable laws and regulations, including GDPR, CCPA, and other data protection laws.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
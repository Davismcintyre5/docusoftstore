import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import WhatsAppButton from '../components/whatsapp/WhatsAppButton';

const HelpPage = () => {
  const { settings } = useSettings();

  const faqs = [
    { question: 'How do I make a payment?', answer: 'You can pay via M-Pesa STK Push (automatic) or manually send money to our business number and upload a screenshot. After clicking "Buy Now", choose your preferred payment method.' },
    { question: 'How long does manual verification take?', answer: 'Manual payments are verified within 24 hours. You will receive an email notification once your payment is approved and your purchase is available for download.' },
    { question: 'Can I download my purchased items again?', answer: 'Yes, you can download your purchased items anytime from your profile page. All your purchases are saved and available for unlimited downloads.' },
    { question: 'What if I don\'t receive my download link?', answer: 'If you don\'t receive your download link after payment, please check your profile page. All purchased items are available there. If you still can\'t find it, contact our support team via WhatsApp.' },
    { question: 'Is my payment secure?', answer: 'Yes, all payments are processed through M-Pesa, Kenya\'s most trusted mobile payment platform. Your payment details are never stored on our servers.' },
    { question: 'What file formats are supported?', answer: 'Documents: PDF, DOC, DOCX, TXT. Software: EXE, MSI, ZIP, RAR, DMG, PKG. All files are delivered in their original format.' },
    { question: 'How do I contact support?', answer: 'You can reach us via WhatsApp using the button below, or call us during business hours. Our support team is ready to assist you with any issues.' },
    { question: 'What is your refund policy?', answer: 'Due to the digital nature of our products, all sales are final. However, if you experience technical issues with a download, please contact us and we\'ll help resolve the issue.' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Help & Support</h1>
        <p style={styles.subtitle}>Find answers to common questions and get support</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ ...styles.faqItem, borderBottom: index === faqs.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
              <h3 style={styles.faqQuestion}>{faq.question}</h3>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.contactCard}>
        <h2 style={styles.contactTitle}>📞 Contact Us</h2>
        <div style={styles.contactInfo}>
          <div style={styles.contactRow}>
            <span style={styles.contactIcon}>📱</span>
            <div><strong>Phone:</strong> {settings?.businessPhoneNumber || '0768784909'}</div>
          </div>
          <div style={styles.contactRow}>
            <span style={styles.contactIcon}>📧</span>
            <div><strong>Email:</strong> support@docusoft.com</div>
          </div>
          <div style={styles.contactRow}>
            <span style={styles.contactIcon}>💬</span>
            <div><strong>WhatsApp:</strong> {settings?.whatsappNumber || '0768784909'}</div>
          </div>
        </div>

        <div style={styles.hoursSection}>
          <h3 style={styles.hoursTitle}>Business Hours</h3>
          <ul style={styles.hoursList}>
            {settings?.businessHours ? (
              Object.entries(settings.businessHours).map(([day, hours]) => (
                <li key={day} style={styles.hoursRow}>
                  <span style={styles.hoursDay}>{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                  <span style={styles.hoursTime}>{hours}</span>
                </li>
              ))
            ) : (
              <>
                <li style={styles.hoursRow}><span>Monday - Friday:</span><span>9am - 5pm</span></li>
                <li style={styles.hoursRow}><span>Saturday:</span><span>Closed</span></li>
                <li style={styles.hoursRow}><span>Sunday:</span><span>Closed</span></li>
              </>
            )}
          </ul>
        </div>

        <WhatsAppButton message="Hello, I need help with your store. Can you assist me?" />
        <p style={styles.responseTime}>Typically responds within 30 minutes during business hours</p>
      </div>

      <div style={styles.linksCard}>
        <h2 style={styles.linksTitle}>Quick Links</h2>
        <div style={styles.linksGrid}>
          <Link to="/documents" style={styles.linkItem}><span style={styles.linkIcon}>📄</span> Browse Documents</Link>
          <Link to="/software" style={styles.linkItem}><span style={styles.linkIcon}>💻</span> Browse Software</Link>
          <Link to="/profile" style={styles.linkItem}><span style={styles.linkIcon}>👤</span> My Purchases</Link>
          <Link to="/" style={styles.linkItem}><span style={styles.linkIcon}>🏠</span> Homepage</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#718096' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
  cardTitle: { fontSize: '24px', fontWeight: '600', color: '#2d3748', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #667eea' },
  faqList: { display: 'flex', flexDirection: 'column', gap: '24px' },
  faqItem: { paddingBottom: '20px' },
  faqQuestion: { fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' },
  faqAnswer: { fontSize: '15px', color: '#4a5568', lineHeight: '1.6' },
  contactCard: { backgroundColor: '#ebf8ff', borderRadius: '16px', padding: '32px', marginBottom: '24px', textAlign: 'center', border: '2px dashed #4299e1' }, // Fixed border line
  contactTitle: { fontSize: '24px', fontWeight: '600', color: '#2c5282', marginBottom: '24px' },
  contactInfo: { display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '24px' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  contactIcon: { fontSize: '24px' },
  hoursSection: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' },
  hoursTitle: { fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '16px' },
  hoursList: { listStyle: 'none', padding: 0, display: 'inline-block', textAlign: 'left' },
  hoursRow: { display: 'flex', justifyContent: 'space-between', gap: '32px', padding: '6px 0', fontSize: '14px', color: '#4a5568' },
  hoursDay: { fontWeight: '500', textTransform: 'capitalize' },
  hoursTime: { color: '#718096' },
  responseTime: { fontSize: '12px', color: '#718096', marginTop: '16px' },
  linksCard: { backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
  linksTitle: { fontSize: '20px', fontWeight: '600', color: '#2d3748', marginBottom: '20px', textAlign: 'center' },
  linksGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  linkItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: '#f7fafc', borderRadius: '10px', textDecoration: 'none', color: '#2d3748', transition: 'all 0.3s' },
  linkIcon: { fontSize: '20px' },
};

// Add hover styles via style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .link-item:hover {
    background-color: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .faq-item:hover .faq-question {
    color: #667eea;
  }
  @media (max-width: 768px) {
    .contact-info {
      flex-direction: column;
      align-items: center;
    }
    .contact-row {
      width: 100%;
      justify-content: center;
    }
    .links-grid {
      grid-template-columns: 1fr;
    }
    .faq-question {
      font-size: 16px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default HelpPage;
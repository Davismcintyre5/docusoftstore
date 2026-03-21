import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DocumentCard from '../components/items/DocumentCard';
import SoftwareCard from '../components/items/SoftwareCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSettings } from '../context/SettingsContext';

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [software, setSoftware] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, softRes] = await Promise.all([
          api.get('/documents?limit=6'),
          api.get('/software?limit=6')
        ]);
        setDocuments(docsRes.data);
        setSoftware(softRes.data);
        
        // Create featured items mix (first 3 from each)
        const featured = [...docsRes.data.slice(0, 3), ...softRes.data.slice(0, 3)];
        setFeaturedItems(featured);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading DocuSoft Store..." />;

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.badgeIcon}>✨</span>
            <span>Premium Digital Content</span>
          </div>
          <h1 style={styles.heroTitle}>
            Your Essential <span style={styles.gradientText}>Documents</span> & <br />
            <span style={styles.gradientText2}>Software</span> Provider
          </h1>
          <p style={styles.heroSubtitle}>
            Access thousands of premium documents and software instantly.
            Download, use, and boost your productivity today.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/documents" style={styles.btnPrimary}>
              <span>📄</span> Browse Documents
            </Link>
            <Link to="/software" style={styles.btnSecondary}>
              <span>💻</span> Browse Software
            </Link>
          </div>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>10,000+</span>
              <span style={styles.statLabel}>Documents</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Software</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>50,000+</span>
              <span style={styles.statLabel}>Happy Users</span>
            </div>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.floatingCard1}>
            <span>📄</span>
            <span>Business Plan 2024</span>
          </div>
          <div style={styles.floatingCard2}>
            <span>💻</span>
            <span>Design Pro</span>
          </div>
          <div style={styles.floatingCard3}>
            <span>📊</span>
            <span>Analytics Tool</span>
          </div>
          <div style={styles.heroGlow}></div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Why Choose Us</span>
          <h2 style={styles.sectionTitle}>Everything You Need in One Place</h2>
          <p style={styles.sectionSubtitle}>
            We provide high-quality digital products with instant access and premium support
          </p>
        </div>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h3>Instant Download</h3>
            <p>Get immediate access to your purchases right after payment</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3>Secure Payments</h3>
            <p>Safe and encrypted transactions with M-Pesa integration</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔄</div>
            <h3>Lifetime Access</h3>
            <p>Download your purchased items anytime, anywhere</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💬</div>
            <h3>24/7 Support</h3>
            <p>Dedicated support team ready to help you</p>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section style={styles.featured}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Featured Items</span>
          <h2 style={styles.sectionTitle}>Popular This Week</h2>
          <p style={styles.sectionSubtitle}>
            Discover our most downloaded and highly rated items
          </p>
        </div>
        <div style={styles.cardGrid}>
          {featuredItems.slice(0, 6).map((item) => {
            const isDocument = item.fileInfo?.extension === '.pdf' || item.fileInfo?.extension === '.doc';
            return isDocument ? (
              <DocumentCard key={item._id} document={item} />
            ) : (
              <SoftwareCard key={item._id} software={item} />
            );
          })}
        </div>
      </section>

      {/* Recent Documents Section */}
      <section style={styles.recent}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionBadge}>Latest Additions</span>
            <h2 style={styles.sectionTitle}>Recent Documents</h2>
          </div>
          <Link to="/documents" style={styles.viewAllLink}>
            View All <span style={styles.arrow}>→</span>
          </Link>
        </div>
        <div style={styles.cardGrid}>
          {documents.slice(0, 4).map(doc => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
        </div>
      </section>

      {/* Recent Software Section */}
      <section style={styles.recent}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionBadge}>Latest Additions</span>
            <h2 style={styles.sectionTitle}>Recent Software</h2>
          </div>
          <Link to="/software" style={styles.viewAllLink}>
            View All <span style={styles.arrow}>→</span>
          </Link>
        </div>
        <div style={styles.cardGrid}>
          {software.slice(0, 4).map(soft => (
            <SoftwareCard key={soft._id} software={soft} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaText}>
            Join thousands of satisfied customers and access premium digital content today
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/register" style={styles.ctaBtnPrimary}>
              Create Free Account
            </Link>
            <Link to="/help" style={styles.ctaBtnSecondary}>
              Learn More
            </Link>
          </div>
        </div>
        <div style={styles.ctaPattern}></div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },

  // Hero Section
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    padding: '60px 0 80px',
    position: 'relative',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#667eea',
    marginBottom: '24px',
  },
  badgeIcon: {
    fontSize: '16px',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '24px',
    color: '#1a202c',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  gradientText2: {
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#718096',
    marginBottom: '32px',
    maxWidth: '500px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
  },
  statLabel: {
    fontSize: '13px',
    color: '#a0aec0',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#e2e8f0',
  },
  heroImage: {
    position: 'relative',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCard1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    background: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'float 6s ease-in-out infinite',
  },
  floatingCard2: {
    position: 'absolute',
    bottom: '30%',
    right: '15%',
    background: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  floatingCard3: {
    position: 'absolute',
    top: '50%',
    right: '30%',
    background: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'float 7s ease-in-out infinite',
  },
  heroGlow: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, rgba(102,126,234,0) 70%)',
    borderRadius: '50%',
    zIndex: 0,
  },

  // Features Section
  features: {
    padding: '80px 0',
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: '48px',
    textAlign: 'center',
  },
  sectionBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#718096',
    maxWidth: '600px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    marginTop: '32px',
  },
  featureCard: {
    textAlign: 'center',
    padding: '32px 24px',
    background: 'white',
    borderRadius: '20px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },

  // Recent Items
  recent: {
    padding: '40px 0',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '24px',
  },
  viewAllLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s',
  },
  arrow: {
    fontSize: '18px',
    transition: 'transform 0.3s',
  },

  // CTA Section
  cta: {
    margin: '60px 0 80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '32px',
    padding: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: 'white',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '18px',
    opacity: 0.95,
    marginBottom: '32px',
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaBtnPrimary: {
    padding: '14px 32px',
    background: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  ctaBtnSecondary: {
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    border: '2px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s',
  },
  ctaPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    pointerEvents: 'none',
  },
};

// Add animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-15px);
    }
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  .btn-secondary:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }
  
  .view-all-link:hover .arrow {
    transform: translateX(4px);
  }
  
  .cta-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }
  
  .cta-btn-secondary:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
`;
document.head.appendChild(styleSheet);

export default HomePage;
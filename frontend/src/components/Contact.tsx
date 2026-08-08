'use client';

import Image from 'next/image';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-label="Contact and location">
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">Visit Our Showroom</p>
          <h2 className="section-title">
            Let Us Find the<br />
            <em>Perfect Piece for You</em>
          </h2>
          <div className="gold-divider" />
        </div>

        <div className={styles.grid}>

          {/* LEFT COLUMN: Owner Card + Map */}
          <div className={styles.leftCol}>

            {/* Owner Card */}
            <div className={styles.ownerCard}>
              <div className={styles.ownerTop}>
                <div className={styles.ownerAvatar}>
                  <span>SA</span>
                  <div className={styles.avatarRing} />
                </div>
                <div>
                  <h3 className={styles.ownerName}>Shivanshu Agrawal</h3>
                  <p className={styles.ownerTitle}>Proprietor, M/S Suman Jewellers</p>
                </div>
              </div>

              <div className={styles.contactDetails}>
                <a href="tel:+919838722733" className={styles.contactRow} id="contact-phone">
                  <div className={styles.contactIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <span>+91 98387 22733</span>
                </a>

                <div className={styles.contactRow}>
                  <div className={styles.contactIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span>Wellesley Ganj, near Sai Baba Temple,<br />Mirzapur, Uttar Pradesh</span>
                </div>

                <div className={styles.contactRow}>
                  <div className={styles.contactIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span>Mon – Sat: 11:15 AM – 8:00 PM<br />Sunday: Closed</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className={styles.ctaGroup}>
                <a
                  href="https://wa.me/919838722733?text=Hello%20Shivanshu%20ji%2C%20I%20am%20interested%20in%20your%20jewellery%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  id="contact-whatsapp-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
                <a href="tel:+919838722733" className="btn-outline" id="contact-call-btn">
                  Call Now
                </a>
              </div>
            </div>

            {/* Google Map */}
            <div className={styles.mapWrap}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d82.5715288!3d25.1511869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fc1bf9ddd85eb%3A0xaf3a7e2288cb8880!2sSJ!5e0!3m2!1sen!2sin!4v1713098000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.6)', display: 'block', minHeight: '220px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="M/S Suman Jewellers Location"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: Showroom Image (full height) */}
          <div className={styles.showroomImgWrap}>
            <Image
              src="/images/showroom-streetview.jpg"
              alt="Suman Jewellers Storefront Wellesley Ganj"
              fill
              sizes="(max-width: 900px) 100vw, 600px"
              style={{ objectFit: 'cover', objectPosition: '78% top' }}
              className={styles.showroomImg}
              priority
            />
            <div className={styles.showroomOverlay}>
              <span>Wellesley Ganj Showroom</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer strip */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          © 2025 M/S Suman Jewellers. All rights reserved. &nbsp;·&nbsp;
          Crafted with ♦ in Mirzapur, Uttar Pradesh.
        </p>
      </div>
    </section>
  );
}

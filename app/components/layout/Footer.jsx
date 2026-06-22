import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Top strip */}
      <div className={styles.topStrip}>
        <div className="container">
          <p className={styles.freeShip}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="m16 8 5 3v5h-5V8Z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Envío gratis en compras mayores a ₲ 500.000
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brandCol}>
            <div className={styles.footerLogo}>
              <span className={styles.logoL}>L</span>
              <span className={styles.logoUXA}>UXA</span>
            </div>
            <p className={styles.tagline}>
              Perfumería, cosmética y accesorios de lujo.<br />
              Curados para quienes aprecian lo extraordinario.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.21 8.21 0 0 0 4.79 1.52V6.78a4.85 4.85 0 0 1-1.02-.09Z"/></svg>
              </a>
              <a href="https://wa.me/595981000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Categorías</h4>
            <ul className={styles.linkList}>
              <li><Link href="/categoria/masculino" className={styles.footerLink}>Perfumes Masculinos</Link></li>
              <li><Link href="/categoria/femenino" className={styles.footerLink}>Perfumes Femeninos</Link></li>
              <li><Link href="/categoria/unisex" className={styles.footerLink}>Fragancias Unisex</Link></li>
              <li><Link href="/categoria/cuidado" className={styles.footerLink}>Cuidado Personal</Link></li>
              <li><Link href="/novedades" className={styles.footerLink}>Novedades</Link></li>
            </ul>
          </div>

          {/* Información */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Información</h4>
            <ul className={styles.linkList}>
              <li><Link href="/sobre-nosotros" className={styles.footerLink}>Sobre Nosotros</Link></li>
              <li><Link href="/envios" className={styles.footerLink}>Envíos y Entregas</Link></li>
              <li><Link href="/cambios" className={styles.footerLink}>Cambios y Devoluciones</Link></li>
              <li><Link href="/autenticidad" className={styles.footerLink}>Garantía de Autenticidad</Link></li>
              <li><Link href="/faq" className={styles.footerLink}>Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Contacto</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="https://wa.me/595981000000" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                  WhatsApp: +595 981 000 000
                </a>
              </li>
              <li>
                <a href="mailto:hola@tiendaluxa.com.py" className={styles.footerLink}>
                  hola@tiendaluxa.com.py
                </a>
              </li>
              <li className={styles.address}>Asunción, Paraguay</li>
            </ul>
            <div className={styles.payMethods}>
              <span className={styles.payBadge}>SIPAP</span>
              <span className={styles.payBadge}>Efectivo</span>
              <span className={styles.payBadge}>QR</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} Tienda Luxa. Todos los derechos reservados.
          </p>
          <div className={styles.legal}>
            <Link href="/terminos" className={styles.legalLink}>Términos y Condiciones</Link>
            <span>·</span>
            <Link href="/privacidad" className={styles.legalLink}>Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

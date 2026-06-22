'use client';

import { useState } from 'react';
import styles from './StepShipping.module.css';

const initialForm = {
  fullName:    '',
  email:       '',
  phone:       '',
  address:     '',
  city:        '',
  notes:       '',
};

const CITIES = [
  'Asunción', 'San Lorenzo', 'Luque', 'Capiatá', 'Fernando de la Mora',
  'Lambaré', 'Limpio', 'Ñemby', 'Mariano Roque Alonso', 'Encarnación',
  'Ciudad del Este', 'Pedro Juan Caballero', 'Concepción', 'Villarrica',
  'Coronel Oviedo', 'Caaguazú', 'Pilar', 'Otra ciudad',
];

export default function StepShipping({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const data = formData || initialForm;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!data.fullName.trim())  errs.fullName = 'El nombre es obligatorio.';
    if (!data.email.trim())     errs.email    = 'El email es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                errs.email    = 'Ingresá un email válido.';
    if (!data.phone.trim())     errs.phone    = 'El número de WhatsApp es obligatorio.';
    if (!data.address.trim())   errs.address  = 'La dirección es obligatoria.';
    if (!data.city)             errs.city     = 'Seleccioná una ciudad.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstErr = document.querySelector('[data-error="true"]');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onNext();
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Datos de Envío y Contacto</h2>
      <p className={styles.stepDesc}>Completá tus datos para que podamos coordinar la entrega.</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.grid}>
          {/* Nombre Completo */}
          <div className={styles.field} data-error={!!errors.fullName}>
            <label htmlFor="fullName" className={styles.label}>
              Nombre Completo <span className={styles.required}>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
              placeholder="Ej: María González"
              value={data.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={styles.field} data-error={!!errors.email}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="ejemplo@correo.com"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className={styles.field} data-error={!!errors.phone}>
            <label htmlFor="phone" className={styles.label}>
              Número de WhatsApp <span className={styles.required}>*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              placeholder="+595 9XX XXX XXX"
              value={data.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>

          {/* City */}
          <div className={styles.field} data-error={!!errors.city}>
            <label htmlFor="city" className={styles.label}>
              Ciudad <span className={styles.required}>*</span>
            </label>
            <select
              id="city"
              name="city"
              className={`${styles.input} ${styles.select} ${errors.city ? styles.inputError : ''}`}
              value={data.city}
              onChange={handleChange}
            >
              <option value="">Seleccioná tu ciudad</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.city && <span className={styles.error}>{errors.city}</span>}
          </div>

          {/* Address — full width */}
          <div className={`${styles.field} ${styles.fullWidth}`} data-error={!!errors.address}>
            <label htmlFor="address" className={styles.label}>
              Dirección de Envío <span className={styles.required}>*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
              placeholder="Calle, número, barrio, referencias"
              value={data.address}
              onChange={handleChange}
              autoComplete="street-address"
            />
            {errors.address && <span className={styles.error}>{errors.address}</span>}
          </div>

          {/* Notes — optional, full width */}
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor="notes" className={styles.label}>
              Notas Adicionales <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              className={styles.textarea}
              placeholder="Indicaciones especiales para la entrega, horarios preferidos, etc."
              rows={3}
              value={data.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.backBtn} onClick={onBack}>
            ← Volver al carrito
          </button>
          <button
            type="submit"
            id="checkout-step2-next"
            className="btn-gold"
            style={{ paddingInline: 'var(--space-12)', justifyContent: 'center' }}
          >
            Continuar al Pago
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </form>
    </div>
  );
}

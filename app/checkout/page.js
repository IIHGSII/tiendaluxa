'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import StepCart from '../components/checkout/StepCart';
import StepShipping from '../components/checkout/StepShipping';
import StepPayment from '../components/checkout/StepPayment';
import styles from './checkout.module.css';

const initialShippingData = {
  fullName:    '',
  email:       '',
  phone:       '',
  address:     '',
  city:        '',
  notes:       '',
};

export default function CheckoutPage() {
  const { items } = useCart();
  const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment
  const [shippingData, setShippingData] = useState(initialShippingData);

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setStep(prev => prev - 1);
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className={styles.emptyCheckout}>
        <div className={styles.emptyContent}>
          <h1 className={styles.emptyTitle}>Tu Carrito está Vacío</h1>
          <p className={styles.emptyText}>
            Añade algunos de nuestros exquisitos productos de perfumería y cosmética antes de proceder al pago.
          </p>
          <Link href="/" className={styles.continueBtn}>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-20) var(--space-4) var(--space-28)' }}>
      {/* Wizard progress indicator */}
      <div className={styles.wizardProgress} aria-label="Progreso de compra">
        <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
          <span className={styles.stepNum}>1</span>
          <span className={styles.stepName}>Carrito</span>
        </div>
        <div className={styles.progressLine} />
        <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles.stepNum}>2</span>
          <span className={styles.stepName}>Envío</span>
        </div>
        <div className={styles.progressLine} />
        <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
          <span className={styles.stepNum}>3</span>
          <span className={styles.stepName}>Confirmación</span>
        </div>
      </div>

      {/* Steps */}
      <main>
        {step === 1 && (
          <StepCart onNext={handleNextStep} />
        )}
        {step === 2 && (
          <StepShipping
            formData={shippingData}
            setFormData={setShippingData}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        )}
        {step === 3 && (
          <StepPayment
            formData={shippingData}
            onBack={handleBackStep}
          />
        )}
      </main>
    </div>
  );
}

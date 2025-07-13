'use client';
import { useEffect } from 'react';
import Script from 'next/script';

export default function Analytics() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-GJ06SF2WRF');
  }, []);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-GJ06SF2WRF"
        strategy="afterInteractive"
      />
    </>
  );
}

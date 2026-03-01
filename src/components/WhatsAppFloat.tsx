const defaultWhatsAppNumber = "+250782987977";

export function WhatsAppFloat() {
  const configuredNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || defaultWhatsAppNumber).replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${configuredNumber}?text=${encodeURIComponent("Hello Paccy Unigate, I need support.")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 52,
        height: 52,
        borderRadius: "50%",
        backgroundColor: "#25D366",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false">
        <path
          fill="#fff"
          d="M19.11 17.44c-.29-.15-1.7-.84-1.97-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.14-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.47-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.56-.88-2.13-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.51.07-.77.36-.26.29-1 1-1 2.44 0 1.44 1.03 2.83 1.18 3.03.15.19 2.03 3.1 4.92 4.35.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.12-.26-.19-.55-.34zM16.01 3.2C8.94 3.2 3.2 8.94 3.2 16c0 2.26.59 4.47 1.71 6.42L3.2 28.8l6.55-1.67A12.73 12.73 0 0016.01 28.8c7.06 0 12.8-5.74 12.8-12.8S23.07 3.2 16.01 3.2zm0 23.36c-2.04 0-4.04-.55-5.8-1.58l-.41-.24-3.89.99 1.03-3.79-.27-.43a10.56 10.56 0 01-1.62-5.51c0-5.87 4.79-10.66 10.67-10.66 2.84 0 5.51 1.1 7.51 3.11A10.56 10.56 0 0126.69 16c0 5.88-4.79 10.56-10.68 10.56z"
        />
      </svg>
    </a>
  );
}

export const companyInfo = {
  name: "Ondosoft",
  email: "contact@ondosoft.com",
  calendlyUrl: "https://calendly.com/scheduleondo",
  timezoneAbbr: "MST",
  timezoneIANA: "America/Denver",
  // Optional: if set, submissions will be POSTed here in addition to localStorage capture
  leadWebhookUrl: "",
  // E.164 formatted phone for links and structured data
  phoneE164: "+15551234567",
  // Human-friendly phone for display
  phoneDisplay: "+1 (555) 123-4567",
  // Alternative sales/urgent line if different; fallback to primary
  urgentPhoneE164: "+18003654441",
  urgentPhoneDisplay: "+1-800-365-4441",
  address: {
    streetAddress: "2701 N Thanksgiving Way",
    addressLocality: "Lehi",
    addressRegion: "Utah",
    postalCode: "84043",
    addressCountry: "US",
  },
  hours: [
    { day: "Mon-Fri", opens: "09:00", closes: "18:00", timeZone: "America/Denver" },
    { day: "Sat", opens: "10:00", closes: "14:00", timeZone: "America/Denver" },
    { day: "Sun", closed: true },
  ],
  urls: {
    website: "https://ondosoft.com",
    github: "https://github.com/ondosoft",
  },
};

export function getPostalAddressSchema() {
  return {
    "@type": "PostalAddress",
    streetAddress: companyInfo.address.streetAddress,
    addressLocality: companyInfo.address.addressLocality,
    addressRegion: companyInfo.address.addressRegion,
    postalCode: companyInfo.address.postalCode,
    addressCountry: companyInfo.address.addressCountry,
  };
}

export function getContactPointSchema(contactType = "customer service") {
  return {
    "@type": "ContactPoint",
    telephone: companyInfo.phoneE164,
    contactType,
    email: companyInfo.email,
  };
}


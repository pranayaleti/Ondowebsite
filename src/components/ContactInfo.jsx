import { Mail, Phone, MapPin } from "lucide-react";
import { companyInfo } from "../constants/companyInfo";

/**
 * Reusable ContactInfo component - Single source of truth for displaying contact information
 * @param {Object} props
 * @param {string} props.variant - Display variant: 'default' | 'compact' | 'detailed'
 * @param {boolean} props.showIcons - Whether to show icons (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const ContactInfo = ({ 
  variant = 'default', 
  showIcons = true,
  className = '' 
}) => {
  const addressString = `${companyInfo.address.streetAddress}, ${companyInfo.address.addressLocality}, ${companyInfo.address.addressRegion} ${companyInfo.address.postalCode}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 text-sm ${className}`}>
        <div className="flex items-center text-neutral-300">
          {showIcons && <Mail className="mr-2 text-orange-500 w-4 h-4" />}
          <a href={`mailto:${companyInfo.email}`} className="hover:text-orange-400 transition-colors">
            {companyInfo.email}
          </a>
        </div>
        <div className="flex items-center text-neutral-300">
          {showIcons && <Phone className="mr-2 text-orange-500 w-4 h-4" />}
          <a href={`tel:${companyInfo.phoneE164}`} className="hover:text-orange-400 transition-colors">
            {companyInfo.phoneDisplay}
          </a>
        </div>
        <div className="flex items-center text-neutral-300">
          {showIcons && <MapPin className="mr-2 text-orange-500 w-4 h-4" />}
          <a 
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 transition-colors"
          >
            {addressString}
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">
                {companyInfo.email}
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a href={`tel:${companyInfo.phoneE164}`} className="text-orange-500 hover:underline">
                {companyInfo.phoneDisplay}
              </a>
            </p>
            <p>
              <strong>Address:</strong> {addressString}
            </p>
            <p>
              <strong>Website:</strong>{' '}
              <a href={companyInfo.urls.website} className="text-orange-500 hover:underline">
                {companyInfo.urls.website}
              </a>
            </p>
          </div>
        </div>
        {companyInfo.hours && companyInfo.hours.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-300">
              {companyInfo.hours.map((schedule, index) => (
                <p key={index}>
                  {schedule.day}: {schedule.closed ? 'Closed' : `${schedule.opens} - ${schedule.closes} ${schedule.timeZone || ''}`}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center text-neutral-300">
        {showIcons && <Mail className="mr-3 text-orange-500" />}
        <a href={`mailto:${companyInfo.email}`} className="hover:text-orange-400 transition-colors">
          {companyInfo.email}
        </a>
      </div>
      <div className="flex items-center text-neutral-300">
        {showIcons && <Phone className="mr-3 text-orange-500" />}
        <a href={`tel:${companyInfo.phoneE164}`} className="hover:text-orange-400 transition-colors">
          {companyInfo.phoneDisplay}
        </a>
      </div>
      <div className="flex items-center text-neutral-300">
        {showIcons && <MapPin className="mr-3 text-orange-500" />}
        <a 
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-400 transition-colors"
        >
          {addressString}
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;


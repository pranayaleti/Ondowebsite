// Unified Data Utility - Single source of truth for all geographic and service data
// Consolidates citiesData.js, citiesList.js, and serviceAreas.json

// All 50 US States with abbreviations and slugs
export const US_STATES = {
  'AL': { name: 'Alabama', slug: 'alabama' },
  'AK': { name: 'Alaska', slug: 'alaska' },
  'AZ': { name: 'Arizona', slug: 'arizona' },
  'AR': { name: 'Arkansas', slug: 'arkansas' },
  'CA': { name: 'California', slug: 'california' },
  'CO': { name: 'Colorado', slug: 'colorado' },
  'CT': { name: 'Connecticut', slug: 'connecticut' },
  'DE': { name: 'Delaware', slug: 'delaware' },
  'FL': { name: 'Florida', slug: 'florida' },
  'GA': { name: 'Georgia', slug: 'georgia' },
  'HI': { name: 'Hawaii', slug: 'hawaii' },
  'ID': { name: 'Idaho', slug: 'idaho' },
  'IL': { name: 'Illinois', slug: 'illinois' },
  'IN': { name: 'Indiana', slug: 'indiana' },
  'IA': { name: 'Iowa', slug: 'iowa' },
  'KS': { name: 'Kansas', slug: 'kansas' },
  'KY': { name: 'Kentucky', slug: 'kentucky' },
  'LA': { name: 'Louisiana', slug: 'louisiana' },
  'ME': { name: 'Maine', slug: 'maine' },
  'MD': { name: 'Maryland', slug: 'maryland' },
  'MA': { name: 'Massachusetts', slug: 'massachusetts' },
  'MI': { name: 'Michigan', slug: 'michigan' },
  'MN': { name: 'Minnesota', slug: 'minnesota' },
  'MS': { name: 'Mississippi', slug: 'mississippi' },
  'MO': { name: 'Missouri', slug: 'missouri' },
  'MT': { name: 'Montana', slug: 'montana' },
  'NE': { name: 'Nebraska', slug: 'nebraska' },
  'NV': { name: 'Nevada', slug: 'nevada' },
  'NH': { name: 'New Hampshire', slug: 'new-hampshire' },
  'NJ': { name: 'New Jersey', slug: 'new-jersey' },
  'NM': { name: 'New Mexico', slug: 'new-mexico' },
  'NY': { name: 'New York', slug: 'new-york' },
  'NC': { name: 'North Carolina', slug: 'north-carolina' },
  'ND': { name: 'North Dakota', slug: 'north-dakota' },
  'OH': { name: 'Ohio', slug: 'ohio' },
  'OK': { name: 'Oklahoma', slug: 'oklahoma' },
  'OR': { name: 'Oregon', slug: 'oregon' },
  'PA': { name: 'Pennsylvania', slug: 'pennsylvania' },
  'RI': { name: 'Rhode Island', slug: 'rhode-island' },
  'SC': { name: 'South Carolina', slug: 'south-carolina' },
  'SD': { name: 'South Dakota', slug: 'south-dakota' },
  'TN': { name: 'Tennessee', slug: 'tennessee' },
  'TX': { name: 'Texas', slug: 'texas' },
  'UT': { name: 'Utah', slug: 'utah' },
  'VT': { name: 'Vermont', slug: 'vermont' },
  'VA': { name: 'Virginia', slug: 'virginia' },
  'WA': { name: 'Washington', slug: 'washington' },
  'WV': { name: 'West Virginia', slug: 'west-virginia' },
  'WI': { name: 'Wisconsin', slug: 'wisconsin' },
  'WY': { name: 'Wyoming', slug: 'wyoming' }
};

// Service types for dynamic content generation
export const SERVICE_TYPES = [
  'web-development',
  'custom-apps',
  'saas-development',
  'freelancing',
  'website-building',
  'ecommerce-solutions',
  'mobile-apps',
  'business-automation'
];

// Major US Cities with their states, counties, and sample zip codes
export const US_CITIES = [
  // California
  { city: 'Los Angeles', state: 'CA', stateName: 'California', county: 'Los Angeles County', zipCodes: ['90210', '90001', '90002', '90003', '90004', '90005'] },
  { city: 'San Francisco', state: 'CA', stateName: 'California', county: 'San Francisco County', zipCodes: ['94102', '94103', '94104', '94105', '94107', '94108'] },
  { city: 'San Diego', state: 'CA', stateName: 'California', county: 'San Diego County', zipCodes: ['92101', '92102', '92103', '92104', '92105', '92106'] },
  { city: 'San Jose', state: 'CA', stateName: 'California', county: 'Santa Clara County', zipCodes: ['95110', '95111', '95112', '95113', '95116', '95117'] },
  { city: 'Sacramento', state: 'CA', stateName: 'California', county: 'Sacramento County', zipCodes: ['95814', '95815', '95816', '95817', '95818', '95819'] },
  { city: 'Fresno', state: 'CA', stateName: 'California', county: 'Fresno County', zipCodes: ['93701', '93702', '93703', '93704', '93705', '93706'] },
  { city: 'Oakland', state: 'CA', stateName: 'California', county: 'Alameda County', zipCodes: ['94601', '94602', '94603', '94604', '94605', '94606'] },
  { city: 'Long Beach', state: 'CA', stateName: 'California', county: 'Los Angeles County', zipCodes: ['90801', '90802', '90803', '90804', '90805', '90806'] },
  { city: 'Bakersfield', state: 'CA', stateName: 'California', county: 'Kern County', zipCodes: ['93301', '93302', '93303', '93304', '93305', '93306'] },
  { city: 'Anaheim', state: 'CA', stateName: 'California', county: 'Orange County', zipCodes: ['92801', '92802', '92803', '92804', '92805', '92806'] },

  // Texas
  { city: 'Houston', state: 'TX', stateName: 'Texas', county: 'Harris County', zipCodes: ['77001', '77002', '77003', '77004', '77005', '77006'] },
  { city: 'San Antonio', state: 'TX', stateName: 'Texas', county: 'Bexar County', zipCodes: ['78201', '78202', '78203', '78204', '78205', '78206'] },
  { city: 'Dallas', state: 'TX', stateName: 'Texas', county: 'Dallas County', zipCodes: ['75201', '75202', '75203', '75204', '75205', '75206'] },
  { city: 'Austin', state: 'TX', stateName: 'Texas', county: 'Travis County', zipCodes: ['78701', '78702', '78703', '78704', '78705', '78706'] },
  { city: 'Fort Worth', state: 'TX', stateName: 'Texas', county: 'Tarrant County', zipCodes: ['76101', '76102', '76103', '76104', '76105', '76106'] },
  { city: 'El Paso', state: 'TX', stateName: 'Texas', county: 'El Paso County', zipCodes: ['79901', '79902', '79903', '79904', '79905', '79906'] },
  { city: 'Arlington', state: 'TX', stateName: 'Texas', county: 'Tarrant County', zipCodes: ['76001', '76002', '76003', '76004', '76005', '76006'] },
  { city: 'Corpus Christi', state: 'TX', stateName: 'Texas', county: 'Nueces County', zipCodes: ['78401', '78402', '78403', '78404', '78405', '78406'] },
  { city: 'Plano', state: 'TX', stateName: 'Texas', county: 'Collin County', zipCodes: ['75023', '75024', '75025', '75026', '75027', '75028'] },
  { city: 'Lubbock', state: 'TX', stateName: 'Texas', county: 'Lubbock County', zipCodes: ['79401', '79402', '79403', '79404', '79405', '79406'] },

  // New York
  { city: 'New York City', state: 'NY', stateName: 'New York', county: 'New York County', zipCodes: ['10001', '10002', '10003', '10004', '10005', '10006'] },
  { city: 'Buffalo', state: 'NY', stateName: 'New York', county: 'Erie County', zipCodes: ['14201', '14202', '14203', '14204', '14205', '14206'] },
  { city: 'Rochester', state: 'NY', stateName: 'New York', county: 'Monroe County', zipCodes: ['14604', '14605', '14606', '14607', '14608', '14609'] },
  { city: 'Yonkers', state: 'NY', stateName: 'New York', county: 'Westchester County', zipCodes: ['10701', '10702', '10703', '10704', '10705', '10706'] },
  { city: 'Syracuse', state: 'NY', stateName: 'New York', county: 'Onondaga County', zipCodes: ['13201', '13202', '13203', '13204', '13205', '13206'] },

  // Florida
  { city: 'Jacksonville', state: 'FL', stateName: 'Florida', county: 'Duval County', zipCodes: ['32201', '32202', '32203', '32204', '32205', '32206'] },
  { city: 'Miami', state: 'FL', stateName: 'Florida', county: 'Miami-Dade County', zipCodes: ['33101', '33102', '33103', '33104', '33105', '33106'] },
  { city: 'Tampa', state: 'FL', stateName: 'Florida', county: 'Hillsborough County', zipCodes: ['33601', '33602', '33603', '33604', '33605', '33606'] },
  { city: 'Orlando', state: 'FL', stateName: 'Florida', county: 'Orange County', zipCodes: ['32801', '32802', '32803', '32804', '32805', '32806'] },
  { city: 'St. Petersburg', state: 'FL', stateName: 'Florida', county: 'Pinellas County', zipCodes: ['33701', '33702', '33703', '33704', '33705', '33706'] },
  { city: 'Hialeah', state: 'FL', stateName: 'Florida', county: 'Miami-Dade County', zipCodes: ['33010', '33011', '33012', '33013', '33014', '33015'] },
  { city: 'Tallahassee', state: 'FL', stateName: 'Florida', county: 'Leon County', zipCodes: ['32301', '32302', '32303', '32304', '32305', '32306'] },
  { city: 'Fort Lauderdale', state: 'FL', stateName: 'Florida', county: 'Broward County', zipCodes: ['33301', '33302', '33303', '33304', '33305', '33306'] },

  // Illinois
  { city: 'Chicago', state: 'IL', stateName: 'Illinois', county: 'Cook County', zipCodes: ['60601', '60602', '60603', '60604', '60605', '60606'] },
  { city: 'Aurora', state: 'IL', stateName: 'Illinois', county: 'Kane County', zipCodes: ['60502', '60503', '60504', '60505', '60506', '60507'] },
  { city: 'Rockford', state: 'IL', stateName: 'Illinois', county: 'Winnebago County', zipCodes: ['61101', '61102', '61103', '61104', '61105', '61106'] },
  { city: 'Joliet', state: 'IL', stateName: 'Illinois', county: 'Will County', zipCodes: ['60431', '60432', '60433', '60434', '60435', '60436'] },
  { city: 'Naperville', state: 'IL', stateName: 'Illinois', county: 'DuPage County', zipCodes: ['60540', '60541', '60542', '60543', '60544', '60545'] },

  // Pennsylvania
  { city: 'Philadelphia', state: 'PA', stateName: 'Pennsylvania', county: 'Philadelphia County', zipCodes: ['19101', '19102', '19103', '19104', '19105', '19106'] },
  { city: 'Pittsburgh', state: 'PA', stateName: 'Pennsylvania', county: 'Allegheny County', zipCodes: ['15201', '15202', '15203', '15204', '15205', '15206'] },
  { city: 'Allentown', state: 'PA', stateName: 'Pennsylvania', county: 'Lehigh County', zipCodes: ['18101', '18102', '18103', '18104', '18105', '18106'] },
  { city: 'Erie', state: 'PA', stateName: 'Pennsylvania', county: 'Erie County', zipCodes: ['16501', '16502', '16503', '16504', '16505', '16506'] },
  { city: 'Reading', state: 'PA', stateName: 'Pennsylvania', county: 'Berks County', zipCodes: ['19601', '19602', '19603', '19604', '19605', '19606'] },

  // Ohio
  { city: 'Columbus', state: 'OH', stateName: 'Ohio', county: 'Franklin County', zipCodes: ['43201', '43202', '43203', '43204', '43205', '43206'] },
  { city: 'Cleveland', state: 'OH', stateName: 'Ohio', county: 'Cuyahoga County', zipCodes: ['44101', '44102', '44103', '44104', '44105', '44106'] },
  { city: 'Cincinnati', state: 'OH', stateName: 'Ohio', county: 'Hamilton County', zipCodes: ['45201', '45202', '45203', '45204', '45205', '45206'] },
  { city: 'Toledo', state: 'OH', stateName: 'Ohio', county: 'Lucas County', zipCodes: ['43601', '43602', '43603', '43604', '43605', '43606'] },
  { city: 'Akron', state: 'OH', stateName: 'Ohio', county: 'Summit County', zipCodes: ['44301', '44302', '44303', '44304', '44305', '44306'] },

  // Georgia
  { city: 'Atlanta', state: 'GA', stateName: 'Georgia', county: 'Fulton County', zipCodes: ['30301', '30302', '30303', '30304', '30305', '30306'] },
  { city: 'Augusta', state: 'GA', stateName: 'Georgia', county: 'Richmond County', zipCodes: ['30901', '30902', '30903', '30904', '30905', '30906'] },
  { city: 'Columbus', state: 'GA', stateName: 'Georgia', county: 'Muscogee County', zipCodes: ['31901', '31902', '31903', '31904', '31905', '31906'] },
  { city: 'Savannah', state: 'GA', stateName: 'Georgia', county: 'Chatham County', zipCodes: ['31401', '31402', '31403', '31404', '31405', '31406'] },
  { city: 'Athens', state: 'GA', stateName: 'Georgia', county: 'Clarke County', zipCodes: ['30601', '30602', '30603', '30604', '30605', '30606'] },

  // North Carolina
  { city: 'Charlotte', state: 'NC', stateName: 'North Carolina', county: 'Mecklenburg County', zipCodes: ['28201', '28202', '28203', '28204', '28205', '28206'] },
  { city: 'Raleigh', state: 'NC', stateName: 'North Carolina', county: 'Wake County', zipCodes: ['27601', '27602', '27603', '27604', '27605', '27606'] },
  { city: 'Greensboro', state: 'NC', stateName: 'North Carolina', county: 'Guilford County', zipCodes: ['27401', '27402', '27403', '27404', '27405', '27406'] },
  { city: 'Durham', state: 'NC', stateName: 'North Carolina', county: 'Durham County', zipCodes: ['27701', '27702', '27703', '27704', '27705', '27706'] },
  { city: 'Winston-Salem', state: 'NC', stateName: 'North Carolina', county: 'Forsyth County', zipCodes: ['27101', '27102', '27103', '27104', '27105', '27106'] },

  // Michigan
  { city: 'Detroit', state: 'MI', stateName: 'Michigan', county: 'Wayne County', zipCodes: ['48201', '48202', '48203', '48204', '48205', '48206'] },
  { city: 'Grand Rapids', state: 'MI', stateName: 'Michigan', county: 'Kent County', zipCodes: ['49501', '49502', '49503', '49504', '49505', '49506'] },
  { city: 'Warren', state: 'MI', stateName: 'Michigan', county: 'Macomb County', zipCodes: ['48088', '48089', '48090', '48091', '48092', '48093'] },
  { city: 'Sterling Heights', state: 'MI', stateName: 'Michigan', county: 'Macomb County', zipCodes: ['48310', '48311', '48312', '48313', '48314', '48315'] },
  { city: 'Lansing', state: 'MI', stateName: 'Michigan', county: 'Ingham County', zipCodes: ['48901', '48902', '48903', '48904', '48905', '48906'] },

  // New Jersey
  { city: 'Newark', state: 'NJ', stateName: 'New Jersey', county: 'Essex County', zipCodes: ['07101', '07102', '07103', '07104', '07105', '07106'] },
  { city: 'Jersey City', state: 'NJ', stateName: 'New Jersey', county: 'Hudson County', zipCodes: ['07301', '07302', '07303', '07304', '07305', '07306'] },
  { city: 'Paterson', state: 'NJ', stateName: 'New Jersey', county: 'Passaic County', zipCodes: ['07501', '07502', '07503', '07504', '07505', '07506'] },
  { city: 'Elizabeth', state: 'NJ', stateName: 'New Jersey', county: 'Union County', zipCodes: ['07201', '07202', '07203', '07204', '07205', '07206'] },
  { city: 'Edison', state: 'NJ', stateName: 'New Jersey', county: 'Middlesex County', zipCodes: ['08817', '08818', '08819', '08820', '08821', '08822'] },

  // Virginia
  { city: 'Virginia Beach', state: 'VA', stateName: 'Virginia', county: 'Virginia Beach City', zipCodes: ['23451', '23452', '23453', '23454', '23455', '23456'] },
  { city: 'Norfolk', state: 'VA', stateName: 'Virginia', county: 'Norfolk City', zipCodes: ['23501', '23502', '23503', '23504', '23505', '23506'] },
  { city: 'Chesapeake', state: 'VA', stateName: 'Virginia', county: 'Chesapeake City', zipCodes: ['23320', '23321', '23322', '23323', '23324', '23325'] },
  { city: 'Richmond', state: 'VA', stateName: 'Virginia', county: 'Richmond City', zipCodes: ['23219', '23220', '23221', '23222', '23223', '23224'] },
  { city: 'Newport News', state: 'VA', stateName: 'Virginia', county: 'Newport News City', zipCodes: ['23601', '23602', '23603', '23604', '23605', '23606'] },

  // Washington
  { city: 'Seattle', state: 'WA', stateName: 'Washington', county: 'King County', zipCodes: ['98101', '98102', '98103', '98104', '98105', '98106'] },
  { city: 'Spokane', state: 'WA', stateName: 'Washington', county: 'Spokane County', zipCodes: ['99201', '99202', '99203', '99204', '99205', '99206'] },
  { city: 'Tacoma', state: 'WA', stateName: 'Washington', county: 'Pierce County', zipCodes: ['98401', '98402', '98403', '98404', '98405', '98406'] },
  { city: 'Vancouver', state: 'WA', stateName: 'Washington', county: 'Clark County', zipCodes: ['98660', '98661', '98662', '98663', '98664', '98665'] },
  { city: 'Bellevue', state: 'WA', stateName: 'Washington', county: 'King County', zipCodes: ['98004', '98005', '98006', '98007', '98008', '98009'] },

  // Massachusetts
  { city: 'Boston', state: 'MA', stateName: 'Massachusetts', county: 'Suffolk County', zipCodes: ['02101', '02102', '02103', '02104', '02105', '02106'] },
  { city: 'Worcester', state: 'MA', stateName: 'Massachusetts', county: 'Worcester County', zipCodes: ['01601', '01602', '01603', '01604', '01605', '01606'] },
  { city: 'Springfield', state: 'MA', stateName: 'Massachusetts', county: 'Hampden County', zipCodes: ['01101', '01102', '01103', '01104', '01105', '01106'] },
  { city: 'Cambridge', state: 'MA', stateName: 'Massachusetts', county: 'Middlesex County', zipCodes: ['02138', '02139', '02140', '02141', '02142', '02143'] },
  { city: 'Lowell', state: 'MA', stateName: 'Massachusetts', county: 'Middlesex County', zipCodes: ['01850', '01851', '01852', '01853', '01854', '01855'] }
];

// Top 10 major cities for service areas
export const TOP_CITIES = [
  { name: 'New York', state: 'NY', slug: 'new-york-ny', displayName: 'New York, NY' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca', displayName: 'Los Angeles, CA' },
  { name: 'Chicago', state: 'IL', slug: 'chicago-il', displayName: 'Chicago, IL' },
  { name: 'Houston', state: 'TX', slug: 'houston-tx', displayName: 'Houston, TX' },
  { name: 'Dallas', state: 'TX', slug: 'dallas-tx', displayName: 'Dallas, TX' },
  { name: 'Miami', state: 'FL', slug: 'miami-fl', displayName: 'Miami, FL' },
  { name: 'Atlanta', state: 'GA', slug: 'atlanta-ga', displayName: 'Atlanta, GA' },
  { name: 'Seattle', state: 'WA', slug: 'seattle-wa', displayName: 'Seattle, WA' },
  { name: 'San Francisco', state: 'CA', slug: 'san-francisco-ca', displayName: 'San Francisco, CA' },
  { name: 'Boston', state: 'MA', slug: 'boston-ma', displayName: 'Boston, MA' }
];

// All 50 states for service areas
export const STATES = Object.entries(US_STATES).map(([code, data]) => ({
  name: data.name,
  slug: data.slug,
  abbreviation: code
}));

// Unified service areas utility
export const SERVICE_AREAS = {
  // All 50 US states
  states: STATES,
  
  // Top 10 major cities
  topCities: TOP_CITIES,
  
  // Get all state names
  getStateNames: () => STATES.map(state => state.name),
  
  // Get all state slugs
  getStateSlugs: () => STATES.map(state => state.slug),
  
  // Get all city names
  getCityNames: () => TOP_CITIES.map(city => city.displayName),
  
  // Get all city slugs
  getCitySlugs: () => TOP_CITIES.map(city => city.slug),
  
  // Get state by slug
  getStateBySlug: (slug) => STATES.find(state => state.slug === slug),
  
  // Get city by slug
  getCityBySlug: (slug) => TOP_CITIES.find(city => city.slug === slug),
  
  // Get all service area URLs for sitemap
  getServiceAreaUrls: () => [
    ...STATES.map(state => ({
      url: `/services/${state.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    })),
    ...TOP_CITIES.map(city => ({
      url: `/services/${city.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    }))
  ],
  
  // Generate schema markup for service areas
  getServiceAreaSchema: () => [
    // Top 10 states for schema
    ...STATES.slice(0, 10).map(state => ({
      "@type": "State",
      "name": state.name,
      "alternateName": state.abbreviation
    })),
    // All top cities for schema
    ...TOP_CITIES.map(city => ({
      "@type": "City",
      "name": city.name,
      "containedInPlace": {
        "@type": "State",
        "name": city.state
      }
    }))
  ],
  
  // Generate keywords string for meta tags
  getKeywordsString: () => {
    const stateNames = STATES.map(state => state.name).join(', ');
    const cityNames = TOP_CITIES.map(city => city.displayName).join(', ');
    return `software development, freelancing, full stack, SaaS, web apps, mobile apps, Ondosoft, US software company, hire developers, React, Node.js, Python, Java, cloud deployment, custom software, ${stateNames}, ${cityNames}`;
  },
  
  // Generate hidden SEO content for pages
  getHiddenSEOContent: () => ({
    states: STATES.map(state => ({
      name: state.name,
      slug: state.slug,
      linkText: `Software development services in ${state.name} - Freelancing, full stack development, and SaaS solutions`,
      url: `/services/${state.slug}`
    })),
    cities: TOP_CITIES.map(city => ({
      name: city.displayName,
      slug: city.slug,
      linkText: `Freelancing and full stack development in ${city.displayName} - Custom software and SaaS solutions`,
      url: `/services/${city.slug}`
    }))
  }),
  
  // Get service area count for analytics
  getStats: () => ({
    totalStates: STATES.length,
    totalCities: TOP_CITIES.length,
    totalServiceAreas: STATES.length + TOP_CITIES.length
  })
};

// Helper functions for city data
export const getCityBySlug = (citySlug, stateSlug) => {
  return US_CITIES.find(city => 
    city.city.toLowerCase().replace(/\s+/g, '-') === citySlug && 
    city.state.toLowerCase() === stateSlug
  );
};

export const getAllCities = () => {
  return US_CITIES;
};

export const getCitiesByState = (stateCode) => {
  return US_CITIES.filter(city => city.state === stateCode.toUpperCase());
};

export const generateCitySlug = (cityName) => {
  return cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
};

export const generateStateSlug = (stateCode) => {
  return stateCode.toLowerCase();
};

// Generate all possible city-service combinations for sitemap
export const generateAllCityServiceCombinations = () => {
  const combinations = [];
  US_CITIES.forEach(city => {
    SERVICE_TYPES.forEach(service => {
      combinations.push({
        city: city.city,
        citySlug: generateCitySlug(city.city),
        state: city.state,
        stateSlug: generateStateSlug(city.state),
        stateName: city.stateName,
        county: city.county,
        service,
        url: `/services/${service}/${generateCitySlug(city.city)}-${generateStateSlug(city.state)}`
      });
    });
  });
  return combinations;
};

// Individual exports are already defined above for backward compatibility

export default SERVICE_AREAS;

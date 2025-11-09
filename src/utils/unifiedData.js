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
  { city: 'Los Angeles', state: 'CA', stateName: 'California', county: 'Los Angeles County', zipCodes: ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010', '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020', '90021', '90022', '90023', '90024', '90025', '90026', '90027', '90028', '90029', '90030', '90031', '90032', '90033', '90034', '90035', '90036', '90037', '90038', '90039', '90040', '90041', '90042', '90043', '90044', '90045', '90046', '90047', '90048', '90049', '90050', '90051', '90052', '90053', '90054', '90055', '90056', '90057', '90058', '90059', '90060', '90061', '90062', '90063', '90064', '90065', '90066', '90067', '90068', '90069', '90070', '90071', '90072', '90073', '90074', '90075', '90076', '90077', '90078', '90079', '90080', '90081', '90082', '90083', '90084', '90085', '90086', '90087', '90088', '90089', '90090', '90091', '90092', '90093', '90094', '90095', '90096', '90097', '90098', '90099', '90100', '90210', '90211', '90212', '90213', '90214', '90215'] },
  { city: 'San Francisco', state: 'CA', stateName: 'California', county: 'San Francisco County', zipCodes: ['94102', '94103', '94104', '94105', '94106', '94107', '94108', '94109', '94110', '94111', '94112', '94113', '94114', '94115', '94116', '94117', '94118', '94119', '94120', '94121', '94122', '94123', '94124', '94125', '94126', '94127', '94128', '94129', '94130', '94131', '94132', '94133', '94134', '94135', '94136', '94137', '94138', '94139', '94140', '94141', '94142', '94143', '94144', '94145', '94146', '94147', '94148', '94149', '94150', '94151', '94152', '94153', '94154', '94155', '94156', '94157', '94158', '94159', '94160', '94161', '94162', '94163', '94164', '94165', '94166', '94167', '94168', '94169', '94170', '94171', '94172', '94173', '94174', '94175', '94176', '94177', '94178', '94179', '94180', '94181', '94182', '94183', '94184', '94185', '94186', '94187', '94188', '94189', '94190', '94191', '94192', '94193', '94194', '94195', '94196', '94197', '94198', '94199'] },
  { city: 'San Diego', state: 'CA', stateName: 'California', county: 'San Diego County', zipCodes: ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110', '92111', '92112', '92113', '92114', '92115', '92116', '92117', '92118', '92119', '92120', '92121', '92122', '92123', '92124', '92125', '92126', '92127', '92128', '92129', '92130', '92131', '92132', '92133', '92134', '92135', '92136', '92137', '92138', '92139', '92140', '92141', '92142', '92143', '92144', '92145', '92146', '92147', '92148', '92149', '92150', '92151', '92152', '92153', '92154', '92155', '92156', '92157', '92158', '92159', '92160', '92161', '92162', '92163', '92164', '92165', '92166', '92167', '92168', '92169', '92170', '92171', '92172', '92173', '92174', '92175', '92176', '92177', '92178', '92179', '92180', '92181', '92182', '92183', '92184', '92185', '92186', '92187', '92188', '92189', '92190', '92191', '92192', '92193', '92194', '92195', '92196', '92197', '92198', '92199'] },
  { city: 'San Jose', state: 'CA', stateName: 'California', county: 'Santa Clara County', zipCodes: ['95110', '95111', '95112', '95113', '95116', '95117'] },
  { city: 'Sacramento', state: 'CA', stateName: 'California', county: 'Sacramento County', zipCodes: ['95814', '95815', '95816', '95817', '95818', '95819'] },
  { city: 'Fresno', state: 'CA', stateName: 'California', county: 'Fresno County', zipCodes: ['93701', '93702', '93703', '93704', '93705', '93706'] },
  { city: 'Oakland', state: 'CA', stateName: 'California', county: 'Alameda County', zipCodes: ['94601', '94602', '94603', '94604', '94605', '94606'] },
  { city: 'Long Beach', state: 'CA', stateName: 'California', county: 'Los Angeles County', zipCodes: ['90801', '90802', '90803', '90804', '90805', '90806'] },
  { city: 'Bakersfield', state: 'CA', stateName: 'California', county: 'Kern County', zipCodes: ['93301', '93302', '93303', '93304', '93305', '93306'] },
  { city: 'Anaheim', state: 'CA', stateName: 'California', county: 'Orange County', zipCodes: ['92801', '92802', '92803', '92804', '92805', '92806'] },

  // Texas
  { city: 'Houston', state: 'TX', stateName: 'Texas', county: 'Harris County', zipCodes: ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010', '77011', '77012', '77013', '77014', '77015', '77016', '77017', '77018', '77019', '77020', '77021', '77022', '77023', '77024', '77025', '77026', '77027', '77028', '77029', '77030', '77031', '77032', '77033', '77034', '77035', '77036', '77037', '77038', '77039', '77040', '77041', '77042', '77043', '77044', '77045', '77046', '77047', '77048', '77049', '77050', '77051', '77052', '77053', '77054', '77055', '77056', '77057', '77058', '77059', '77060', '77061', '77062', '77063', '77064', '77065', '77066', '77067', '77068', '77069', '77070', '77071', '77072', '77073', '77074', '77075', '77076', '77077', '77078', '77079', '77080', '77081', '77082', '77083', '77084', '77085', '77086', '77087', '77088', '77089', '77090', '77091', '77092', '77093', '77094', '77095', '77096', '77097', '77098', '77099'] },
  { city: 'San Antonio', state: 'TX', stateName: 'Texas', county: 'Bexar County', zipCodes: ['78201', '78202', '78203', '78204', '78205', '78206', '78207', '78208', '78209', '78210', '78211', '78212', '78213', '78214', '78215', '78216', '78217', '78218', '78219', '78220', '78221', '78222', '78223', '78224', '78225', '78226', '78227', '78228', '78229', '78230', '78231', '78232', '78233', '78234', '78235', '78236', '78237', '78238', '78239', '78240', '78241', '78242', '78243', '78244', '78245', '78246', '78247', '78248', '78249', '78250', '78251', '78252', '78253', '78254', '78255', '78256', '78257', '78258', '78259', '78260', '78261', '78262', '78263', '78264', '78265', '78266', '78267', '78268', '78269', '78270', '78271', '78272', '78273', '78274', '78275', '78276', '78277', '78278', '78279', '78280', '78281', '78282', '78283', '78284', '78285', '78286', '78287', '78288', '78289', '78290', '78291', '78292', '78293', '78294', '78295', '78296', '78297', '78298', '78299'] },
  { city: 'Dallas', state: 'TX', stateName: 'Texas', county: 'Dallas County', zipCodes: ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210', '75211', '75212', '75213', '75214', '75215', '75216', '75217', '75218', '75219', '75220', '75221', '75222', '75223', '75224', '75225', '75226', '75227', '75228', '75229', '75230', '75231', '75232', '75233', '75234', '75235', '75236', '75237', '75238', '75239', '75240', '75241', '75242', '75243', '75244', '75245', '75246', '75247', '75248', '75249', '75250', '75251', '75252', '75253', '75254', '75255', '75256', '75257', '75258', '75259', '75260', '75261', '75262', '75263', '75264', '75265', '75266', '75267', '75268', '75269', '75270', '75271', '75272', '75273', '75274', '75275', '75276', '75277', '75278', '75279', '75280', '75281', '75282', '75283', '75284', '75285', '75286', '75287', '75288', '75289', '75290', '75291', '75292', '75293', '75294', '75295', '75296', '75297', '75298', '75299'] },
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
  { city: 'Boston', state: 'MA', stateName: 'Massachusetts', county: 'Suffolk County', zipCodes: ['02101', '02102', '02103', '02104', '02105', '02106', '02107', '02108', '02109', '02110', '02111', '02112', '02113', '02114', '02115', '02116', '02117', '02118', '02119', '02120'] },
  { city: 'Worcester', state: 'MA', stateName: 'Massachusetts', county: 'Worcester County', zipCodes: ['01601', '01602', '01603', '01604', '01605', '01606', '01607', '01608', '01609', '01610'] },
  { city: 'Springfield', state: 'MA', stateName: 'Massachusetts', county: 'Hampden County', zipCodes: ['01101', '01102', '01103', '01104', '01105', '01106', '01107', '01108', '01109', '01110'] },
  { city: 'Cambridge', state: 'MA', stateName: 'Massachusetts', county: 'Middlesex County', zipCodes: ['02138', '02139', '02140', '02141', '02142', '02143'] },
  { city: 'Lowell', state: 'MA', stateName: 'Massachusetts', county: 'Middlesex County', zipCodes: ['01850', '01851', '01852', '01853', '01854', '01855'] },

  // Arizona
  { city: 'Phoenix', state: 'AZ', stateName: 'Arizona', county: 'Maricopa County', zipCodes: ['85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010', '85011', '85012', '85013', '85014', '85015', '85016', '85017', '85018', '85019', '85020'] },
  { city: 'Tucson', state: 'AZ', stateName: 'Arizona', county: 'Pima County', zipCodes: ['85701', '85702', '85703', '85704', '85705', '85706', '85707', '85708', '85709', '85710'] },
  { city: 'Mesa', state: 'AZ', stateName: 'Arizona', county: 'Maricopa County', zipCodes: ['85201', '85202', '85203', '85204', '85205', '85206', '85207', '85208', '85209', '85210'] },
  { city: 'Chandler', state: 'AZ', stateName: 'Arizona', county: 'Maricopa County', zipCodes: ['85224', '85225', '85226', '85227', '85228', '85229'] },
  { city: 'Scottsdale', state: 'AZ', stateName: 'Arizona', county: 'Maricopa County', zipCodes: ['85250', '85251', '85252', '85253', '85254', '85255'] },

  // Colorado
  { city: 'Denver', state: 'CO', stateName: 'Colorado', county: 'Denver County', zipCodes: ['80201', '80202', '80203', '80204', '80205', '80206', '80207', '80208', '80209', '80210', '80211', '80212', '80213', '80214', '80215', '80216', '80217', '80218', '80219', '80220'] },
  { city: 'Colorado Springs', state: 'CO', stateName: 'Colorado', county: 'El Paso County', zipCodes: ['80901', '80902', '80903', '80904', '80905', '80906', '80907', '80908', '80909', '80910'] },
  { city: 'Aurora', state: 'CO', stateName: 'Colorado', county: 'Arapahoe County', zipCodes: ['80010', '80011', '80012', '80013', '80014', '80015', '80016', '80017', '80018', '80019'] },
  { city: 'Fort Collins', state: 'CO', stateName: 'Colorado', county: 'Larimer County', zipCodes: ['80521', '80522', '80523', '80524', '80525', '80526'] },
  { city: 'Boulder', state: 'CO', stateName: 'Colorado', county: 'Boulder County', zipCodes: ['80301', '80302', '80303', '80304', '80305', '80306'] },

  // Indiana
  { city: 'Indianapolis', state: 'IN', stateName: 'Indiana', county: 'Marion County', zipCodes: ['46201', '46202', '46203', '46204', '46205', '46206', '46207', '46208', '46209', '46210', '46211', '46212', '46213', '46214', '46215', '46216', '46217', '46218', '46219', '46220'] },
  { city: 'Fort Wayne', state: 'IN', stateName: 'Indiana', county: 'Allen County', zipCodes: ['46801', '46802', '46803', '46804', '46805', '46806', '46807', '46808', '46809', '46810'] },
  { city: 'Evansville', state: 'IN', stateName: 'Indiana', county: 'Vanderburgh County', zipCodes: ['47701', '47702', '47703', '47704', '47705', '47706'] },
  { city: 'South Bend', state: 'IN', stateName: 'Indiana', county: 'St. Joseph County', zipCodes: ['46601', '46602', '46603', '46604', '46605', '46606'] },
  { city: 'Carmel', state: 'IN', stateName: 'Indiana', county: 'Hamilton County', zipCodes: ['46032', '46033', '46034', '46035', '46036', '46037'] },

  // Tennessee
  { city: 'Nashville', state: 'TN', stateName: 'Tennessee', county: 'Davidson County', zipCodes: ['37201', '37202', '37203', '37204', '37205', '37206', '37207', '37208', '37209', '37210', '37211', '37212', '37213', '37214', '37215', '37216', '37217', '37218', '37219', '37220'] },
  { city: 'Memphis', state: 'TN', stateName: 'Tennessee', county: 'Shelby County', zipCodes: ['38101', '38102', '38103', '38104', '38105', '38106', '38107', '38108', '38109', '38110', '38111', '38112', '38113', '38114', '38115', '38116', '38117', '38118', '38119', '38120'] },
  { city: 'Knoxville', state: 'TN', stateName: 'Tennessee', county: 'Knox County', zipCodes: ['37901', '37902', '37903', '37904', '37905', '37906', '37907', '37908', '37909', '37910'] },
  { city: 'Chattanooga', state: 'TN', stateName: 'Tennessee', county: 'Hamilton County', zipCodes: ['37401', '37402', '37403', '37404', '37405', '37406', '37407', '37408', '37409', '37410'] },
  { city: 'Clarksville', state: 'TN', stateName: 'Tennessee', county: 'Montgomery County', zipCodes: ['37040', '37041', '37042', '37043', '37044', '37045'] },

  // Missouri
  { city: 'Kansas City', state: 'MO', stateName: 'Missouri', county: 'Jackson County', zipCodes: ['64101', '64102', '64103', '64104', '64105', '64106', '64107', '64108', '64109', '64110', '64111', '64112', '64113', '64114', '64115', '64116', '64117', '64118', '64119', '64120'] },
  { city: 'St. Louis', state: 'MO', stateName: 'Missouri', county: 'St. Louis City', zipCodes: ['63101', '63102', '63103', '63104', '63105', '63106', '63107', '63108', '63109', '63110', '63111', '63112', '63113', '63114', '63115', '63116', '63117', '63118', '63119', '63120'] },
  { city: 'Springfield', state: 'MO', stateName: 'Missouri', county: 'Greene County', zipCodes: ['65801', '65802', '65803', '65804', '65805', '65806', '65807', '65808', '65809', '65810'] },
  { city: 'Columbia', state: 'MO', stateName: 'Missouri', county: 'Boone County', zipCodes: ['65201', '65202', '65203', '65204', '65205', '65206'] },
  { city: 'Independence', state: 'MO', stateName: 'Missouri', county: 'Jackson County', zipCodes: ['64050', '64051', '64052', '64053', '64054', '64055'] },

  // Maryland
  { city: 'Baltimore', state: 'MD', stateName: 'Maryland', county: 'Baltimore City', zipCodes: ['21201', '21202', '21203', '21204', '21205', '21206', '21207', '21208', '21209', '21210', '21211', '21212', '21213', '21214', '21215', '21216', '21217', '21218', '21219', '21220'] },
  { city: 'Frederick', state: 'MD', stateName: 'Maryland', county: 'Frederick County', zipCodes: ['21701', '21702', '21703', '21704', '21705', '21706'] },
  { city: 'Rockville', state: 'MD', stateName: 'Maryland', county: 'Montgomery County', zipCodes: ['20850', '20851', '20852', '20853', '20854', '20855'] },
  { city: 'Gaithersburg', state: 'MD', stateName: 'Maryland', county: 'Montgomery County', zipCodes: ['20877', '20878', '20879', '20880', '20881', '20882'] },
  { city: 'Bowie', state: 'MD', stateName: 'Maryland', county: 'Prince George\'s County', zipCodes: ['20715', '20716', '20717', '20718', '20719', '20720'] },

  // Wisconsin
  { city: 'Milwaukee', state: 'WI', stateName: 'Wisconsin', county: 'Milwaukee County', zipCodes: ['53201', '53202', '53203', '53204', '53205', '53206', '53207', '53208', '53209', '53210', '53211', '53212', '53213', '53214', '53215', '53216', '53217', '53218', '53219', '53220'] },
  { city: 'Madison', state: 'WI', stateName: 'Wisconsin', county: 'Dane County', zipCodes: ['53701', '53702', '53703', '53704', '53705', '53706', '53707', '53708', '53709', '53710'] },
  { city: 'Green Bay', state: 'WI', stateName: 'Wisconsin', county: 'Brown County', zipCodes: ['54301', '54302', '54303', '54304', '54305', '54306'] },
  { city: 'Kenosha', state: 'WI', stateName: 'Wisconsin', county: 'Kenosha County', zipCodes: ['53140', '53141', '53142', '53143', '53144', '53145'] },
  { city: 'Racine', state: 'WI', stateName: 'Wisconsin', county: 'Racine County', zipCodes: ['53401', '53402', '53403', '53404', '53405', '53406'] },

  // Minnesota
  { city: 'Minneapolis', state: 'MN', stateName: 'Minnesota', county: 'Hennepin County', zipCodes: ['55401', '55402', '55403', '55404', '55405', '55406', '55407', '55408', '55409', '55410', '55411', '55412', '55413', '55414', '55415', '55416', '55417', '55418', '55419', '55420'] },
  { city: 'St. Paul', state: 'MN', stateName: 'Minnesota', county: 'Ramsey County', zipCodes: ['55101', '55102', '55103', '55104', '55105', '55106', '55107', '55108', '55109', '55110'] },
  { city: 'Rochester', state: 'MN', stateName: 'Minnesota', county: 'Olmsted County', zipCodes: ['55901', '55902', '55903', '55904', '55905', '55906'] },
  { city: 'Duluth', state: 'MN', stateName: 'Minnesota', county: 'St. Louis County', zipCodes: ['55801', '55802', '55803', '55804', '55805', '55806'] },
  { city: 'Bloomington', state: 'MN', stateName: 'Minnesota', county: 'Hennepin County', zipCodes: ['55420', '55421', '55422', '55423', '55424', '55425'] },

  // Louisiana
  { city: 'New Orleans', state: 'LA', stateName: 'Louisiana', county: 'Orleans Parish', zipCodes: ['70112', '70113', '70114', '70115', '70116', '70117', '70118', '70119', '70120', '70121', '70122', '70123', '70124', '70125', '70126', '70127', '70128', '70129', '70130', '70131'] },
  { city: 'Baton Rouge', state: 'LA', stateName: 'Louisiana', county: 'East Baton Rouge Parish', zipCodes: ['70801', '70802', '70803', '70804', '70805', '70806', '70807', '70808', '70809', '70810'] },
  { city: 'Shreveport', state: 'LA', stateName: 'Louisiana', county: 'Caddo Parish', zipCodes: ['71101', '71102', '71103', '71104', '71105', '71106', '71107', '71108', '71109', '71110'] },
  { city: 'Lafayette', state: 'LA', stateName: 'Louisiana', county: 'Lafayette Parish', zipCodes: ['70501', '70502', '70503', '70504', '70505', '70506'] },
  { city: 'Lake Charles', state: 'LA', stateName: 'Louisiana', county: 'Calcasieu Parish', zipCodes: ['70601', '70602', '70603', '70604', '70605', '70606'] },

  // Oregon
  { city: 'Portland', state: 'OR', stateName: 'Oregon', county: 'Multnomah County', zipCodes: ['97201', '97202', '97203', '97204', '97205', '97206', '97207', '97208', '97209', '97210', '97211', '97212', '97213', '97214', '97215', '97216', '97217', '97218', '97219', '97220'] },
  { city: 'Eugene', state: 'OR', stateName: 'Oregon', county: 'Lane County', zipCodes: ['97401', '97402', '97403', '97404', '97405', '97406'] },
  { city: 'Salem', state: 'OR', stateName: 'Oregon', county: 'Marion County', zipCodes: ['97301', '97302', '97303', '97304', '97305', '97306'] },
  { city: 'Gresham', state: 'OR', stateName: 'Oregon', county: 'Multnomah County', zipCodes: ['97030', '97031', '97032', '97033', '97034', '97035'] },
  { city: 'Bend', state: 'OR', stateName: 'Oregon', county: 'Deschutes County', zipCodes: ['97701', '97702', '97703', '97704', '97705', '97706'] },

  // Oklahoma
  { city: 'Oklahoma City', state: 'OK', stateName: 'Oklahoma', county: 'Oklahoma County', zipCodes: ['73101', '73102', '73103', '73104', '73105', '73106', '73107', '73108', '73109', '73110', '73111', '73112', '73113', '73114', '73115', '73116', '73117', '73118', '73119', '73120'] },
  { city: 'Tulsa', state: 'OK', stateName: 'Oklahoma', county: 'Tulsa County', zipCodes: ['74101', '74102', '74103', '74104', '74105', '74106', '74107', '74108', '74109', '74110', '74111', '74112', '74113', '74114', '74115', '74116', '74117', '74118', '74119', '74120'] },
  { city: 'Norman', state: 'OK', stateName: 'Oklahoma', county: 'Cleveland County', zipCodes: ['73069', '73070', '73071', '73072', '73073', '73074'] },
  { city: 'Broken Arrow', state: 'OK', stateName: 'Oklahoma', county: 'Tulsa County', zipCodes: ['74011', '74012', '74013', '74014', '74015', '74016'] },
  { city: 'Lawton', state: 'OK', stateName: 'Oklahoma', county: 'Comanche County', zipCodes: ['73501', '73502', '73503', '73504', '73505', '73506'] },

  // Connecticut
  { city: 'Bridgeport', state: 'CT', stateName: 'Connecticut', county: 'Fairfield County', zipCodes: ['06601', '06602', '06603', '06604', '06605', '06606', '06607', '06608', '06609', '06610'] },
  { city: 'New Haven', state: 'CT', stateName: 'Connecticut', county: 'New Haven County', zipCodes: ['06501', '06502', '06503', '06504', '06505', '06506', '06507', '06508', '06509', '06510'] },
  { city: 'Hartford', state: 'CT', stateName: 'Connecticut', county: 'Hartford County', zipCodes: ['06101', '06102', '06103', '06104', '06105', '06106', '06107', '06108', '06109', '06110'] },
  { city: 'Stamford', state: 'CT', stateName: 'Connecticut', county: 'Fairfield County', zipCodes: ['06901', '06902', '06903', '06904', '06905', '06906'] },
  { city: 'Waterbury', state: 'CT', stateName: 'Connecticut', county: 'New Haven County', zipCodes: ['06701', '06702', '06703', '06704', '06705', '06706'] },

  // Utah
  { city: 'Salt Lake City', state: 'UT', stateName: 'Utah', county: 'Salt Lake County', zipCodes: ['84101', '84102', '84103', '84104', '84105', '84106', '84107', '84108', '84109', '84110', '84111', '84112', '84113', '84114', '84115', '84116', '84117', '84118', '84119', '84120'] },
  { city: 'West Valley City', state: 'UT', stateName: 'Utah', county: 'Salt Lake County', zipCodes: ['84119', '84120', '84121', '84122', '84123', '84124'] },
  { city: 'Provo', state: 'UT', stateName: 'Utah', county: 'Utah County', zipCodes: ['84601', '84602', '84603', '84604', '84605', '84606'] },
  { city: 'West Jordan', state: 'UT', stateName: 'Utah', county: 'Salt Lake County', zipCodes: ['84084', '84085', '84086', '84087', '84088', '84089'] },
  { city: 'Orem', state: 'UT', stateName: 'Utah', county: 'Utah County', zipCodes: ['84057', '84058', '84059', '84060', '84061', '84062'] },

  // Nevada
  { city: 'Las Vegas', state: 'NV', stateName: 'Nevada', county: 'Clark County', zipCodes: ['89101', '89102', '89103', '89104', '89105', '89106', '89107', '89108', '89109', '89110', '89111', '89112', '89113', '89114', '89115', '89116', '89117', '89118', '89119', '89120'] },
  { city: 'Henderson', state: 'NV', stateName: 'Nevada', county: 'Clark County', zipCodes: ['89002', '89003', '89004', '89005', '89006', '89007', '89008', '89009', '89010', '89011', '89012', '89013', '89014', '89015', '89016', '89017', '89018', '89019', '89020', '89021'] },
  { city: 'Reno', state: 'NV', stateName: 'Nevada', county: 'Washoe County', zipCodes: ['89501', '89502', '89503', '89504', '89505', '89506', '89507', '89508', '89509', '89510'] },
  { city: 'North Las Vegas', state: 'NV', stateName: 'Nevada', county: 'Clark County', zipCodes: ['89030', '89031', '89032', '89033', '89034', '89035'] },
  { city: 'Sparks', state: 'NV', stateName: 'Nevada', county: 'Washoe County', zipCodes: ['89431', '89432', '89433', '89434', '89435', '89436'] },

  // District of Columbia
  { city: 'Washington', state: 'DC', stateName: 'District of Columbia', county: 'District of Columbia', zipCodes: ['20001', '20002', '20003', '20004', '20005', '20006', '20007', '20008', '20009', '20010', '20011', '20012', '20013', '20014', '20015', '20016', '20017', '20018', '20019', '20020'] },

  // Alabama
  { city: 'Birmingham', state: 'AL', stateName: 'Alabama', county: 'Jefferson County', zipCodes: ['35201', '35202', '35203', '35204', '35205', '35206', '35207', '35208', '35209', '35210', '35211', '35212', '35213', '35214', '35215', '35216', '35217', '35218', '35219', '35220'] },
  { city: 'Montgomery', state: 'AL', stateName: 'Alabama', county: 'Montgomery County', zipCodes: ['36101', '36102', '36103', '36104', '36105', '36106', '36107', '36108', '36109', '36110'] },
  { city: 'Mobile', state: 'AL', stateName: 'Alabama', county: 'Mobile County', zipCodes: ['36601', '36602', '36603', '36604', '36605', '36606', '36607', '36608', '36609', '36610'] },
  { city: 'Huntsville', state: 'AL', stateName: 'Alabama', county: 'Madison County', zipCodes: ['35801', '35802', '35803', '35804', '35805', '35806', '35807', '35808', '35809', '35810'] },
  { city: 'Tuscaloosa', state: 'AL', stateName: 'Alabama', county: 'Tuscaloosa County', zipCodes: ['35401', '35402', '35403', '35404', '35405', '35406'] },

  // Alaska
  { city: 'Anchorage', state: 'AK', stateName: 'Alaska', county: 'Anchorage Municipality', zipCodes: ['99501', '99502', '99503', '99504', '99505', '99506', '99507', '99508', '99509', '99510', '99511', '99512', '99513', '99514', '99515', '99516', '99517', '99518', '99519', '99520'] },
  { city: 'Fairbanks', state: 'AK', stateName: 'Alaska', county: 'Fairbanks North Star Borough', zipCodes: ['99701', '99702', '99703', '99704', '99705', '99706', '99707', '99708', '99709', '99710'] },
  { city: 'Juneau', state: 'AK', stateName: 'Alaska', county: 'Juneau City and Borough', zipCodes: ['99801', '99802', '99803', '99804', '99805', '99806'] },
  { city: 'Sitka', state: 'AK', stateName: 'Alaska', county: 'Sitka City and Borough', zipCodes: ['99835'] },
  { city: 'Ketchikan', state: 'AK', stateName: 'Alaska', county: 'Ketchikan Gateway Borough', zipCodes: ['99901', '99902', '99903'] },

  // Arkansas
  { city: 'Little Rock', state: 'AR', stateName: 'Arkansas', county: 'Pulaski County', zipCodes: ['72201', '72202', '72203', '72204', '72205', '72206', '72207', '72208', '72209', '72210', '72211', '72212', '72213', '72214', '72215', '72216', '72217', '72218', '72219', '72220'] },
  { city: 'Fort Smith', state: 'AR', stateName: 'Arkansas', county: 'Sebastian County', zipCodes: ['72901', '72902', '72903', '72904', '72905', '72906', '72907', '72908', '72909', '72910'] },
  { city: 'Fayetteville', state: 'AR', stateName: 'Arkansas', county: 'Washington County', zipCodes: ['72701', '72702', '72703', '72704', '72705', '72706'] },
  { city: 'Springdale', state: 'AR', stateName: 'Arkansas', county: 'Washington County', zipCodes: ['72764', '72765', '72766', '72767', '72768', '72769'] },
  { city: 'Jonesboro', state: 'AR', stateName: 'Arkansas', county: 'Craighead County', zipCodes: ['72401', '72402', '72403', '72404', '72405', '72406'] },

  // Delaware
  { city: 'Wilmington', state: 'DE', stateName: 'Delaware', county: 'New Castle County', zipCodes: ['19801', '19802', '19803', '19804', '19805', '19806', '19807', '19808', '19809', '19810'] },
  { city: 'Dover', state: 'DE', stateName: 'Delaware', county: 'Kent County', zipCodes: ['19901', '19902', '19903', '19904', '19905', '19906'] },
  { city: 'Newark', state: 'DE', stateName: 'Delaware', county: 'New Castle County', zipCodes: ['19711', '19712', '19713', '19714', '19715', '19716'] },
  { city: 'Middletown', state: 'DE', stateName: 'Delaware', county: 'New Castle County', zipCodes: ['19709'] },
  { city: 'Smyrna', state: 'DE', stateName: 'Delaware', county: 'Kent County', zipCodes: ['19977'] },

  // Hawaii
  { city: 'Honolulu', state: 'HI', stateName: 'Hawaii', county: 'Honolulu County', zipCodes: ['96801', '96802', '96803', '96804', '96805', '96806', '96807', '96808', '96809', '96810', '96811', '96812', '96813', '96814', '96815', '96816', '96817', '96818', '96819', '96820'] },
  { city: 'Hilo', state: 'HI', stateName: 'Hawaii', county: 'Hawaii County', zipCodes: ['96720', '96721'] },
  { city: 'Kailua', state: 'HI', stateName: 'Hawaii', county: 'Honolulu County', zipCodes: ['96734'] },
  { city: 'Kaneohe', state: 'HI', stateName: 'Hawaii', county: 'Honolulu County', zipCodes: ['96744'] },
  { city: 'Pearl City', state: 'HI', stateName: 'Hawaii', county: 'Honolulu County', zipCodes: ['96782'] },

  // Idaho
  { city: 'Boise', state: 'ID', stateName: 'Idaho', county: 'Ada County', zipCodes: ['83701', '83702', '83703', '83704', '83705', '83706', '83707', '83708', '83709', '83710', '83711', '83712', '83713', '83714', '83715', '83716', '83717', '83718', '83719', '83720'] },
  { city: 'Nampa', state: 'ID', stateName: 'Idaho', county: 'Canyon County', zipCodes: ['83651', '83652', '83653', '83654', '83655', '83656'] },
  { city: 'Meridian', state: 'ID', stateName: 'Idaho', county: 'Ada County', zipCodes: ['83642', '83643', '83644', '83645', '83646', '83647'] },
  { city: 'Idaho Falls', state: 'ID', stateName: 'Idaho', county: 'Bonneville County', zipCodes: ['83401', '83402', '83403', '83404', '83405', '83406'] },
  { city: 'Pocatello', state: 'ID', stateName: 'Idaho', county: 'Bannock County', zipCodes: ['83201', '83202', '83203', '83204', '83205', '83206'] },

  // Iowa
  { city: 'Des Moines', state: 'IA', stateName: 'Iowa', county: 'Polk County', zipCodes: ['50301', '50302', '50303', '50304', '50305', '50306', '50307', '50308', '50309', '50310', '50311', '50312', '50313', '50314', '50315', '50316', '50317', '50318', '50319', '50320'] },
  { city: 'Cedar Rapids', state: 'IA', stateName: 'Iowa', county: 'Linn County', zipCodes: ['52401', '52402', '52403', '52404', '52405', '52406', '52407', '52408', '52409', '52410'] },
  { city: 'Davenport', state: 'IA', stateName: 'Iowa', county: 'Scott County', zipCodes: ['52801', '52802', '52803', '52804', '52805', '52806', '52807', '52808', '52809', '52810'] },
  { city: 'Sioux City', state: 'IA', stateName: 'Iowa', county: 'Woodbury County', zipCodes: ['51101', '51102', '51103', '51104', '51105', '51106'] },
  { city: 'Iowa City', state: 'IA', stateName: 'Iowa', county: 'Johnson County', zipCodes: ['52240', '52241', '52242', '52243', '52244', '52245'] },

  // Kansas
  { city: 'Wichita', state: 'KS', stateName: 'Kansas', county: 'Sedgwick County', zipCodes: ['67201', '67202', '67203', '67204', '67205', '67206', '67207', '67208', '67209', '67210', '67211', '67212', '67213', '67214', '67215', '67216', '67217', '67218', '67219', '67220'] },
  { city: 'Overland Park', state: 'KS', stateName: 'Kansas', county: 'Johnson County', zipCodes: ['66204', '66205', '66206', '66207', '66208', '66209', '66210', '66211', '66212', '66213'] },
  { city: 'Kansas City', state: 'KS', stateName: 'Kansas', county: 'Wyandotte County', zipCodes: ['66101', '66102', '66103', '66104', '66105', '66106', '66107', '66108', '66109', '66110'] },
  { city: 'Olathe', state: 'KS', stateName: 'Kansas', county: 'Johnson County', zipCodes: ['66061', '66062', '66063', '66064', '66065', '66066'] },
  { city: 'Topeka', state: 'KS', stateName: 'Kansas', county: 'Shawnee County', zipCodes: ['66601', '66602', '66603', '66604', '66605', '66606', '66607', '66608', '66609', '66610'] },

  // Kentucky
  { city: 'Louisville', state: 'KY', stateName: 'Kentucky', county: 'Jefferson County', zipCodes: ['40201', '40202', '40203', '40204', '40205', '40206', '40207', '40208', '40209', '40210', '40211', '40212', '40213', '40214', '40215', '40216', '40217', '40218', '40219', '40220'] },
  { city: 'Lexington', state: 'KY', stateName: 'Kentucky', county: 'Fayette County', zipCodes: ['40501', '40502', '40503', '40504', '40505', '40506', '40507', '40508', '40509', '40510', '40511', '40512', '40513', '40514', '40515', '40516', '40517', '40518', '40519', '40520'] },
  { city: 'Bowling Green', state: 'KY', stateName: 'Kentucky', county: 'Warren County', zipCodes: ['42101', '42102', '42103', '42104', '42105', '42106'] },
  { city: 'Owensboro', state: 'KY', stateName: 'Kentucky', county: 'Daviess County', zipCodes: ['42301', '42302', '42303', '42304', '42305', '42306'] },
  { city: 'Covington', state: 'KY', stateName: 'Kentucky', county: 'Kenton County', zipCodes: ['41011', '41012', '41013', '41014', '41015', '41016'] },

  // Maine
  { city: 'Portland', state: 'ME', stateName: 'Maine', county: 'Cumberland County', zipCodes: ['04101', '04102', '04103', '04104', '04105', '04106', '04107', '04108', '04109', '04110'] },
  { city: 'Lewiston', state: 'ME', stateName: 'Maine', county: 'Androscoggin County', zipCodes: ['04240', '04241', '04242', '04243', '04244', '04245'] },
  { city: 'Bangor', state: 'ME', stateName: 'Maine', county: 'Penobscot County', zipCodes: ['04401', '04402', '04403', '04404', '04405', '04406'] },
  { city: 'South Portland', state: 'ME', stateName: 'Maine', county: 'Cumberland County', zipCodes: ['04106', '04107', '04108', '04109', '04110', '04111'] },
  { city: 'Auburn', state: 'ME', stateName: 'Maine', county: 'Androscoggin County', zipCodes: ['04210', '04211', '04212', '04213', '04214', '04215'] },

  // Mississippi
  { city: 'Jackson', state: 'MS', stateName: 'Mississippi', county: 'Hinds County', zipCodes: ['39201', '39202', '39203', '39204', '39205', '39206', '39207', '39208', '39209', '39210', '39211', '39212', '39213', '39214', '39215', '39216', '39217', '39218', '39219', '39220'] },
  { city: 'Gulfport', state: 'MS', stateName: 'Mississippi', county: 'Harrison County', zipCodes: ['39501', '39502', '39503', '39504', '39505', '39506', '39507', '39508', '39509', '39510'] },
  { city: 'Southaven', state: 'MS', stateName: 'Mississippi', county: 'DeSoto County', zipCodes: ['38671', '38672', '38673', '38674', '38675', '38676'] },
  { city: 'Hattiesburg', state: 'MS', stateName: 'Mississippi', county: 'Forrest County', zipCodes: ['39401', '39402', '39403', '39404', '39405', '39406'] },
  { city: 'Biloxi', state: 'MS', stateName: 'Mississippi', county: 'Harrison County', zipCodes: ['39530', '39531', '39532', '39533', '39534', '39535'] },

  // Montana
  { city: 'Billings', state: 'MT', stateName: 'Montana', county: 'Yellowstone County', zipCodes: ['59101', '59102', '59103', '59104', '59105', '59106', '59107', '59108', '59109', '59110'] },
  { city: 'Missoula', state: 'MT', stateName: 'Montana', county: 'Missoula County', zipCodes: ['59801', '59802', '59803', '59804', '59805', '59806', '59807', '59808', '59809', '59810'] },
  { city: 'Great Falls', state: 'MT', stateName: 'Montana', county: 'Cascade County', zipCodes: ['59401', '59402', '59403', '59404', '59405', '59406'] },
  { city: 'Bozeman', state: 'MT', stateName: 'Montana', county: 'Gallatin County', zipCodes: ['59715', '59716', '59717', '59718', '59719', '59720'] },
  { city: 'Butte', state: 'MT', stateName: 'Montana', county: 'Silver Bow County', zipCodes: ['59701', '59702', '59703'] },

  // Nebraska
  { city: 'Omaha', state: 'NE', stateName: 'Nebraska', county: 'Douglas County', zipCodes: ['68101', '68102', '68103', '68104', '68105', '68106', '68107', '68108', '68109', '68110', '68111', '68112', '68113', '68114', '68115', '68116', '68117', '68118', '68119', '68120'] },
  { city: 'Lincoln', state: 'NE', stateName: 'Nebraska', county: 'Lancaster County', zipCodes: ['68501', '68502', '68503', '68504', '68505', '68506', '68507', '68508', '68509', '68510', '68511', '68512', '68513', '68514', '68515', '68516', '68517', '68518', '68519', '68520'] },
  { city: 'Bellevue', state: 'NE', stateName: 'Nebraska', county: 'Sarpy County', zipCodes: ['68005', '68006', '68007', '68008', '68009', '68010'] },
  { city: 'Grand Island', state: 'NE', stateName: 'Nebraska', county: 'Hall County', zipCodes: ['68801', '68802', '68803', '68804', '68805', '68806'] },
  { city: 'Kearney', state: 'NE', stateName: 'Nebraska', county: 'Buffalo County', zipCodes: ['68847', '68848', '68849'] },

  // New Hampshire
  { city: 'Manchester', state: 'NH', stateName: 'New Hampshire', county: 'Hillsborough County', zipCodes: ['03101', '03102', '03103', '03104', '03105', '03106', '03107', '03108', '03109', '03110'] },
  { city: 'Nashua', state: 'NH', stateName: 'New Hampshire', county: 'Hillsborough County', zipCodes: ['03060', '03061', '03062', '03063', '03064', '03065'] },
  { city: 'Concord', state: 'NH', stateName: 'New Hampshire', county: 'Merrimack County', zipCodes: ['03301', '03302', '03303', '03304', '03305', '03306'] },
  { city: 'Derry', state: 'NH', stateName: 'New Hampshire', county: 'Rockingham County', zipCodes: ['03038'] },
  { city: 'Rochester', state: 'NH', stateName: 'New Hampshire', county: 'Strafford County', zipCodes: ['03867', '03868', '03869'] },

  // New Mexico
  { city: 'Albuquerque', state: 'NM', stateName: 'New Mexico', county: 'Bernalillo County', zipCodes: ['87101', '87102', '87103', '87104', '87105', '87106', '87107', '87108', '87109', '87110', '87111', '87112', '87113', '87114', '87115', '87116', '87117', '87118', '87119', '87120'] },
  { city: 'Las Cruces', state: 'NM', stateName: 'New Mexico', county: 'Doña Ana County', zipCodes: ['88001', '88002', '88003', '88004', '88005', '88006', '88007', '88008', '88009', '88010'] },
  { city: 'Rio Rancho', state: 'NM', stateName: 'New Mexico', county: 'Sandoval County', zipCodes: ['87124', '87125', '87126', '87127', '87128', '87129'] },
  { city: 'Santa Fe', state: 'NM', stateName: 'New Mexico', county: 'Santa Fe County', zipCodes: ['87501', '87502', '87503', '87504', '87505', '87506', '87507', '87508', '87509', '87510'] },
  { city: 'Roswell', state: 'NM', stateName: 'New Mexico', county: 'Chaves County', zipCodes: ['88201', '88202', '88203'] },

  // North Dakota
  { city: 'Fargo', state: 'ND', stateName: 'North Dakota', county: 'Cass County', zipCodes: ['58102', '58103', '58104', '58105', '58106', '58107', '58108', '58109', '58110', '58111'] },
  { city: 'Bismarck', state: 'ND', stateName: 'North Dakota', county: 'Burleigh County', zipCodes: ['58501', '58502', '58503', '58504', '58505', '58506', '58507', '58508', '58509', '58510'] },
  { city: 'Grand Forks', state: 'ND', stateName: 'North Dakota', county: 'Grand Forks County', zipCodes: ['58201', '58202', '58203', '58204', '58205', '58206'] },
  { city: 'Minot', state: 'ND', stateName: 'North Dakota', county: 'Ward County', zipCodes: ['58701', '58702', '58703'] },
  { city: 'West Fargo', state: 'ND', stateName: 'North Dakota', county: 'Cass County', zipCodes: ['58078', '58079'] },

  // Rhode Island
  { city: 'Providence', state: 'RI', stateName: 'Rhode Island', county: 'Providence County', zipCodes: ['02901', '02902', '02903', '02904', '02905', '02906', '02907', '02908', '02909', '02910'] },
  { city: 'Warwick', state: 'RI', stateName: 'Rhode Island', county: 'Kent County', zipCodes: ['02886', '02887', '02888', '02889', '02890', '02891'] },
  { city: 'Cranston', state: 'RI', stateName: 'Rhode Island', county: 'Providence County', zipCodes: ['02910', '02920', '02921'] },
  { city: 'Pawtucket', state: 'RI', stateName: 'Rhode Island', county: 'Providence County', zipCodes: ['02860', '02861', '02862'] },
  { city: 'East Providence', state: 'RI', stateName: 'Rhode Island', county: 'Providence County', zipCodes: ['02914', '02915', '02916'] },

  // South Carolina
  { city: 'Charleston', state: 'SC', stateName: 'South Carolina', county: 'Charleston County', zipCodes: ['29401', '29402', '29403', '29404', '29405', '29406', '29407', '29408', '29409', '29410', '29411', '29412', '29413', '29414', '29415', '29416', '29417', '29418', '29419', '29420'] },
  { city: 'Columbia', state: 'SC', stateName: 'South Carolina', county: 'Richland County', zipCodes: ['29201', '29202', '29203', '29204', '29205', '29206', '29207', '29208', '29209', '29210', '29211', '29212', '29213', '29214', '29215', '29216', '29217', '29218', '29219', '29220'] },
  { city: 'North Charleston', state: 'SC', stateName: 'South Carolina', county: 'Charleston County', zipCodes: ['29405', '29406', '29407', '29418', '29419', '29420'] },
  { city: 'Greenville', state: 'SC', stateName: 'South Carolina', county: 'Greenville County', zipCodes: ['29601', '29602', '29603', '29604', '29605', '29606', '29607', '29608', '29609', '29610', '29611', '29612', '29613', '29614', '29615', '29616', '29617', '29618', '29619', '29620'] },
  { city: 'Rock Hill', state: 'SC', stateName: 'South Carolina', county: 'York County', zipCodes: ['29730', '29731', '29732', '29733', '29734', '29735'] },

  // South Dakota
  { city: 'Sioux Falls', state: 'SD', stateName: 'South Dakota', county: 'Minnehaha County', zipCodes: ['57101', '57102', '57103', '57104', '57105', '57106', '57107', '57108', '57109', '57110'] },
  { city: 'Rapid City', state: 'SD', stateName: 'South Dakota', county: 'Pennington County', zipCodes: ['57701', '57702', '57703', '57704', '57705', '57706', '57707', '57708', '57709', '57710'] },
  { city: 'Aberdeen', state: 'SD', stateName: 'South Dakota', county: 'Brown County', zipCodes: ['57401', '57402'] },
  { city: 'Brookings', state: 'SD', stateName: 'South Dakota', county: 'Brookings County', zipCodes: ['57006', '57007'] },
  { city: 'Watertown', state: 'SD', stateName: 'South Dakota', county: 'Codington County', zipCodes: ['57201', '57202'] },

  // Vermont
  { city: 'Burlington', state: 'VT', stateName: 'Vermont', county: 'Chittenden County', zipCodes: ['05401', '05402', '05403', '05404', '05405', '05406', '05407', '05408', '05409', '05410'] },
  { city: 'Essex', state: 'VT', stateName: 'Vermont', county: 'Chittenden County', zipCodes: ['05451', '05452', '05453'] },
  { city: 'South Burlington', state: 'VT', stateName: 'Vermont', county: 'Chittenden County', zipCodes: ['05403', '05404', '05405', '05406', '05407', '05408'] },
  { city: 'Colchester', state: 'VT', stateName: 'Vermont', county: 'Chittenden County', zipCodes: ['05446', '05447', '05448', '05449'] },
  { city: 'Rutland', state: 'VT', stateName: 'Vermont', county: 'Rutland County', zipCodes: ['05701', '05702'] },

  // West Virginia
  { city: 'Charleston', state: 'WV', stateName: 'West Virginia', county: 'Kanawha County', zipCodes: ['25301', '25302', '25303', '25304', '25305', '25306', '25307', '25308', '25309', '25310', '25311', '25312', '25313', '25314', '25315', '25316', '25317', '25318', '25319', '25320'] },
  { city: 'Huntington', state: 'WV', stateName: 'West Virginia', county: 'Cabell County', zipCodes: ['25701', '25702', '25703', '25704', '25705', '25706', '25707', '25708', '25709', '25710'] },
  { city: 'Parkersburg', state: 'WV', stateName: 'West Virginia', county: 'Wood County', zipCodes: ['26101', '26102', '26103', '26104', '26105', '26106'] },
  { city: 'Morgantown', state: 'WV', stateName: 'West Virginia', county: 'Monongalia County', zipCodes: ['26501', '26502', '26503', '26504', '26505', '26506', '26507', '26508', '26509', '26510'] },
  { city: 'Wheeling', state: 'WV', stateName: 'West Virginia', county: 'Ohio County', zipCodes: ['26003', '26004', '26005', '26006', '26007', '26008'] },

  // Wyoming
  { city: 'Cheyenne', state: 'WY', stateName: 'Wyoming', county: 'Laramie County', zipCodes: ['82001', '82002', '82003', '82004', '82005', '82006', '82007', '82008', '82009', '82010'] },
  { city: 'Casper', state: 'WY', stateName: 'Wyoming', county: 'Natrona County', zipCodes: ['82601', '82602', '82603', '82604', '82605', '82606', '82607', '82608', '82609', '82610'] },
  { city: 'Laramie', state: 'WY', stateName: 'Wyoming', county: 'Albany County', zipCodes: ['82070', '82071', '82072', '82073', '82074', '82075'] },
  { city: 'Gillette', state: 'WY', stateName: 'Wyoming', county: 'Campbell County', zipCodes: ['82716', '82717', '82718', '82719', '82720', '82721'] },
  { city: 'Rock Springs', state: 'WY', stateName: 'Wyoming', county: 'Sweetwater County', zipCodes: ['82901', '82902'] }
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
    const stateKeywords = STATES.map(state => `best freelancing site in ${state.name}, top freelancing website in ${state.name}`).join(', ');
    const cityKeywords = TOP_CITIES.map(city => `best freelancing site in ${city.displayName}, top freelancing website in ${city.name}`).join(', ');
    return `best freelancing site, top freelancing website, best freelance developers, hire developers, software development, freelancing platform, best freelancing website, top freelancing site, freelance software developers, full stack development, SaaS development, React developers, Node.js developers, Python developers, mobile app development, web development, custom software, software development, freelancing, full stack, SaaS, web apps, mobile apps, Ondosoft, US software company, hire developers, React, Node.js, Python, Java, cloud deployment, custom software, ${stateNames}, ${cityNames}, ${stateKeywords}, ${cityKeywords}`;
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

// Generate comprehensive areaServed schema format for structured data
// Includes all states, all cities, and optionally all zip codes from unifiedData
// Options:
//   - includeAllStates: include all 50 US states (default: true)
//   - includeAllCities: include all cities from US_CITIES (default: true)
//   - includeZipCodes: include zip codes for each city (default: false, as it creates very large schemas)
//   - cityNames: optional array of specific city names to include (if provided, only these cities are included)
export const getAreaServedSchema = (options = {}) => {
  const {
    includeAllStates = true,
    includeAllCities = true,
    includeZipCodes = false,
    cityNames = null
  } = options;

  const areaServed = [
    {
      "@type": "Country",
      "name": "United States"
    }
  ];

  // Add all 50 US States
  if (includeAllStates) {
    Object.entries(US_STATES).forEach(([code, state]) => {
      areaServed.push({
        "@type": "State",
        "name": state.name,
        "alternateName": code
      });
    });
  }

  // Determine which cities to include
  let citiesToInclude = [];
  if (cityNames && Array.isArray(cityNames) && cityNames.length > 0) {
    // Use specific city names provided
    citiesToInclude = cityNames.map(cityName => {
      // Handle "New York" vs "New York City" variations
      const normalizedName = cityName === "New York" ? "New York City" : cityName;
      return US_CITIES.find(city => 
        city.city === normalizedName || city.city === cityName
      );
    }).filter(Boolean);
  } else if (includeAllCities) {
    // Include ALL cities from US_CITIES
    citiesToInclude = US_CITIES;
  }

  // Add city entries to areaServed
  citiesToInclude.forEach(city => {
    if (city) {
      // Add city entry
      areaServed.push({
        "@type": "City",
        "name": city.city === "New York City" ? "New York" : city.city,
        "containedInPlace": {
          "@type": "State",
          "name": city.stateName
        }
      });

      // Optionally add zip codes as separate PostalCode entries
      if (includeZipCodes && city.zipCodes && city.zipCodes.length > 0) {
        // Limit to first 10 zip codes per city to keep schema manageable
        city.zipCodes.slice(0, 10).forEach(zipCode => {
          areaServed.push({
            "@type": "PostalCode",
            "postalCode": zipCode,
            "addressLocality": city.city === "New York City" ? "New York" : city.city,
            "addressRegion": city.stateName,
            "addressCountry": "US"
          });
        });
      }
    }
  });

  return areaServed;
};

// Individual exports are already defined above for backward compatibility

export default SERVICE_AREAS;

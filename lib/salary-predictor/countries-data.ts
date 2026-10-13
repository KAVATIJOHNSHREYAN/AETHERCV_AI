export interface CityInfo {
  name: string
  multiplier: number // Cost of living & tech compensation multiplier relative to national baseline
  tier: 'Tier 1 Tech Hub' | 'Tier 2 Major Metro' | 'Emerging Tech Center' | 'Standard Metro'
}

export interface StateInfo {
  name: string
  code: string
  multiplier: number
  cities: CityInfo[]
}

export interface CountryInfo {
  name: string
  code: string
  flag: string
  currency: string
  currencySymbol: string
  baseSalaryMultiplier: number // Compared to US baseline in USD purchasing power / global salary index
  states: StateInfo[]
}

export interface CurrencyRate {
  code: string
  name: string
  symbol: string
  rateToUSD: number // 1 USD = X Currency
  formatPattern: 'standard' | 'inr-lpa'
}

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.0, formatPattern: 'standard' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUSD: 86.8, formatPattern: 'inr-lpa' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.95, formatPattern: 'standard' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateToUSD: 0.81, formatPattern: 'standard' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToUSD: 1.42, formatPattern: 'standard' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.58, formatPattern: 'standard' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToUSD: 1.35, formatPattern: 'standard' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUSD: 152.4, formatPattern: 'standard' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rateToUSD: 3.67, formatPattern: 'standard' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', rateToUSD: 3.75, formatPattern: 'standard' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUSD: 0.90, formatPattern: 'standard' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rateToUSD: 10.9, formatPattern: 'standard' },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rateToUSD: 11.2, formatPattern: 'standard' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', rateToUSD: 1435.0, formatPattern: 'standard' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rateToUSD: 4.45, formatPattern: 'standard' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rateToUSD: 5.75, formatPattern: 'standard' },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', rateToUSD: 20.4, formatPattern: 'standard' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUSD: 18.2, formatPattern: 'standard' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rateToUSD: 1.74, formatPattern: 'standard' },
  PLN: { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rateToUSD: 4.08, formatPattern: 'standard' },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rateToUSD: 7.08, formatPattern: 'standard' }
}

export const COUNTRIES_DATABASE: CountryInfo[] = [
  {
    name: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    baseSalaryMultiplier: 1.0,
    states: [
      {
        name: 'California',
        code: 'CA',
        multiplier: 1.25,
        cities: [
          { name: 'San Francisco / Silicon Valley', multiplier: 1.38, tier: 'Tier 1 Tech Hub' },
          { name: 'San Jose / South Bay', multiplier: 1.35, tier: 'Tier 1 Tech Hub' },
          { name: 'Los Angeles', multiplier: 1.18, tier: 'Tier 2 Major Metro' },
          { name: 'San Diego', multiplier: 1.15, tier: 'Tier 2 Major Metro' },
          { name: 'Sacramento', multiplier: 1.05, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Washington',
        code: 'WA',
        multiplier: 1.20,
        cities: [
          { name: 'Seattle', multiplier: 1.28, tier: 'Tier 1 Tech Hub' },
          { name: 'Bellevue / Redmond', multiplier: 1.29, tier: 'Tier 1 Tech Hub' },
          { name: 'Tacoma', multiplier: 1.05, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'New York',
        code: 'NY',
        multiplier: 1.22,
        cities: [
          { name: 'New York City', multiplier: 1.32, tier: 'Tier 1 Tech Hub' },
          { name: 'Buffalo', multiplier: 0.95, tier: 'Standard Metro' },
          { name: 'Albany', multiplier: 0.98, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Texas',
        code: 'TX',
        multiplier: 1.05,
        cities: [
          { name: 'Austin', multiplier: 1.12, tier: 'Tier 1 Tech Hub' },
          { name: 'Dallas - Fort Worth', multiplier: 1.06, tier: 'Tier 2 Major Metro' },
          { name: 'Houston', multiplier: 1.04, tier: 'Tier 2 Major Metro' },
          { name: 'San Antonio', multiplier: 0.98, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Massachusetts',
        code: 'MA',
        multiplier: 1.18,
        cities: [
          { name: 'Boston / Cambridge', multiplier: 1.26, tier: 'Tier 1 Tech Hub' },
          { name: 'Worcester', multiplier: 1.02, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Colorado',
        code: 'CO',
        multiplier: 1.08,
        cities: [
          { name: 'Denver', multiplier: 1.10, tier: 'Tier 2 Major Metro' },
          { name: 'Boulder', multiplier: 1.15, tier: 'Tier 1 Tech Hub' },
          { name: 'Colorado Springs', multiplier: 0.98, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Illinois',
        code: 'IL',
        multiplier: 1.06,
        cities: [
          { name: 'Chicago', multiplier: 1.12, tier: 'Tier 2 Major Metro' },
          { name: 'Naperville', multiplier: 1.04, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Florida',
        code: 'FL',
        multiplier: 1.00,
        cities: [
          { name: 'Miami', multiplier: 1.08, tier: 'Tier 2 Major Metro' },
          { name: 'Orlando', multiplier: 0.98, tier: 'Standard Metro' },
          { name: 'Tampa', multiplier: 1.00, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Remote (US Baseline)',
        code: 'REMOTE_US',
        multiplier: 1.02,
        cities: [
          { name: 'All US Remote Locations', multiplier: 1.02, tier: 'Standard Metro' }
        ]
      }
    ]
  },
  {
    name: 'India',
    code: 'IND',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    baseSalaryMultiplier: 0.28,
    states: [
      {
        name: 'Karnataka',
        code: 'KA',
        multiplier: 1.25,
        cities: [
          { name: 'Bangalore (Bengaluru)', multiplier: 1.30, tier: 'Tier 1 Tech Hub' },
          { name: 'Mysore', multiplier: 0.92, tier: 'Emerging Tech Center' },
          { name: 'Mangalore', multiplier: 0.90, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Telangana',
        code: 'TS',
        multiplier: 1.18,
        cities: [
          { name: 'Hyderabad (Hitec City / Gachibowli)', multiplier: 1.24, tier: 'Tier 1 Tech Hub' },
          { name: 'Warangal', multiplier: 0.85, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Maharashtra',
        code: 'MH',
        multiplier: 1.16,
        cities: [
          { name: 'Pune (Hinjawadi / Magarpatta)', multiplier: 1.18, tier: 'Tier 1 Tech Hub' },
          { name: 'Mumbai (BKC / Powai)', multiplier: 1.22, tier: 'Tier 2 Major Metro' },
          { name: 'Nagpur', multiplier: 0.88, tier: 'Emerging Tech Center' }
        ]
      },
      {
        name: 'Tamil Nadu',
        code: 'TN',
        multiplier: 1.12,
        cities: [
          { name: 'Chennai (OMR / Taramani)', multiplier: 1.16, tier: 'Tier 2 Major Metro' },
          { name: 'Coimbatore', multiplier: 0.92, tier: 'Emerging Tech Center' }
        ]
      },
      {
        name: 'Delhi NCR (Haryana / UP)',
        code: 'NCR',
        multiplier: 1.18,
        cities: [
          { name: 'Gurgaon (Gurugram Cyber Hub)', multiplier: 1.25, tier: 'Tier 1 Tech Hub' },
          { name: 'Noida', multiplier: 1.15, tier: 'Tier 2 Major Metro' },
          { name: 'New Delhi', multiplier: 1.14, tier: 'Tier 2 Major Metro' }
        ]
      },
      {
        name: 'Kerala',
        code: 'KL',
        multiplier: 0.98,
        cities: [
          { name: 'Kochi (Infopark)', multiplier: 1.02, tier: 'Emerging Tech Center' },
          { name: 'Thiruvananthapuram (Technopark)', multiplier: 1.00, tier: 'Emerging Tech Center' }
        ]
      },
      {
        name: 'Andhra Pradesh',
        code: 'AP',
        multiplier: 0.95,
        cities: [
          { name: 'Visakhapatnam (Vizag)', multiplier: 0.98, tier: 'Emerging Tech Center' },
          { name: 'Vijayawada', multiplier: 0.92, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'West Bengal',
        code: 'WB',
        multiplier: 0.98,
        cities: [
          { name: 'Kolkata (Salt Lake Sector V)', multiplier: 1.02, tier: 'Tier 2 Major Metro' }
        ]
      },
      {
        name: 'Gujarat',
        code: 'GJ',
        multiplier: 0.98,
        cities: [
          { name: 'Ahmedabad / GIFT City', multiplier: 1.04, tier: 'Emerging Tech Center' },
          { name: 'Surat', multiplier: 0.92, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Remote (India)',
        code: 'REMOTE_IN',
        multiplier: 1.05,
        cities: [
          { name: 'All India Remote Roles', multiplier: 1.05, tier: 'Standard Metro' }
        ]
      }
    ]
  },
  {
    name: 'United Kingdom',
    code: 'GBR',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    baseSalaryMultiplier: 0.72,
    states: [
      {
        name: 'England',
        code: 'ENG',
        multiplier: 1.15,
        cities: [
          { name: 'London (Tech City)', multiplier: 1.34, tier: 'Tier 1 Tech Hub' },
          { name: 'Cambridge', multiplier: 1.20, tier: 'Tier 1 Tech Hub' },
          { name: 'Oxford', multiplier: 1.18, tier: 'Tier 2 Major Metro' },
          { name: 'Manchester', multiplier: 1.05, tier: 'Tier 2 Major Metro' },
          { name: 'Birmingham', multiplier: 1.02, tier: 'Standard Metro' },
          { name: 'Bristol', multiplier: 1.08, tier: 'Emerging Tech Center' }
        ]
      },
      {
        name: 'Scotland',
        code: 'SCO',
        multiplier: 1.00,
        cities: [
          { name: 'Edinburgh', multiplier: 1.08, tier: 'Tier 2 Major Metro' },
          { name: 'Glasgow', multiplier: 1.02, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Remote (UK)',
        code: 'REMOTE_UK',
        multiplier: 1.08,
        cities: [
          { name: 'All UK Remote Positions', multiplier: 1.08, tier: 'Standard Metro' }
        ]
      }
    ]
  },
  {
    name: 'Canada',
    code: 'CAN',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    baseSalaryMultiplier: 0.78,
    states: [
      {
        name: 'Ontario',
        code: 'ON',
        multiplier: 1.15,
        cities: [
          { name: 'Toronto', multiplier: 1.22, tier: 'Tier 1 Tech Hub' },
          { name: 'Waterloo / Kitchener', multiplier: 1.18, tier: 'Tier 1 Tech Hub' },
          { name: 'Ottawa', multiplier: 1.12, tier: 'Tier 2 Major Metro' }
        ]
      },
      {
        name: 'British Columbia',
        code: 'BC',
        multiplier: 1.14,
        cities: [
          { name: 'Vancouver', multiplier: 1.20, tier: 'Tier 1 Tech Hub' },
          { name: 'Victoria', multiplier: 1.04, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Quebec',
        code: 'QC',
        multiplier: 1.02,
        cities: [
          { name: 'Montreal (AI Hub)', multiplier: 1.12, tier: 'Tier 1 Tech Hub' },
          { name: 'Quebec City', multiplier: 0.98, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Alberta',
        code: 'AB',
        multiplier: 1.04,
        cities: [
          { name: 'Calgary', multiplier: 1.06, tier: 'Tier 2 Major Metro' },
          { name: 'Edmonton', multiplier: 1.02, tier: 'Standard Metro' }
        ]
      }
    ]
  },
  {
    name: 'Germany',
    code: 'DEU',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    baseSalaryMultiplier: 0.76,
    states: [
      {
        name: 'Berlin',
        code: 'BE',
        multiplier: 1.18,
        cities: [
          { name: 'Berlin', multiplier: 1.22, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Bavaria (Bayern)',
        code: 'BY',
        multiplier: 1.22,
        cities: [
          { name: 'Munich (München)', multiplier: 1.30, tier: 'Tier 1 Tech Hub' },
          { name: 'Nuremberg', multiplier: 1.06, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Hesse (Hessen)',
        code: 'HE',
        multiplier: 1.16,
        cities: [
          { name: 'Frankfurt am Main', multiplier: 1.24, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Baden-Württemberg',
        code: 'BW',
        multiplier: 1.14,
        cities: [
          { name: 'Stuttgart', multiplier: 1.18, tier: 'Tier 2 Major Metro' },
          { name: 'Karlsruhe', multiplier: 1.10, tier: 'Emerging Tech Center' }
        ]
      }
    ]
  },
  {
    name: 'Singapore',
    code: 'SGP',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    baseSalaryMultiplier: 0.78,
    states: [
      {
        name: 'Singapore Region',
        code: 'SG',
        multiplier: 1.20,
        cities: [
          { name: 'Central Area / CBD', multiplier: 1.28, tier: 'Tier 1 Tech Hub' },
          { name: 'One-North / Fusionopolis', multiplier: 1.26, tier: 'Tier 1 Tech Hub' },
          { name: 'Jurong Innovation District', multiplier: 1.15, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'Australia',
    code: 'AUS',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    baseSalaryMultiplier: 0.79,
    states: [
      {
        name: 'New South Wales',
        code: 'NSW',
        multiplier: 1.18,
        cities: [
          { name: 'Sydney', multiplier: 1.28, tier: 'Tier 1 Tech Hub' },
          { name: 'Newcastle', multiplier: 0.98, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Victoria',
        code: 'VIC',
        multiplier: 1.12,
        cities: [
          { name: 'Melbourne', multiplier: 1.20, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Queensland',
        code: 'QLD',
        multiplier: 1.02,
        cities: [
          { name: 'Brisbane', multiplier: 1.08, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'United Arab Emirates',
    code: 'ARE',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    baseSalaryMultiplier: 0.75,
    states: [
      {
        name: 'Dubai',
        code: 'DXB',
        multiplier: 1.22,
        cities: [
          { name: 'Dubai Internet City / DIFC', multiplier: 1.28, tier: 'Tier 1 Tech Hub' },
          { name: 'Downtown Dubai', multiplier: 1.22, tier: 'Tier 2 Major Metro' }
        ]
      },
      {
        name: 'Abu Dhabi',
        code: 'AUH',
        multiplier: 1.16,
        cities: [
          { name: 'Abu Dhabi Global Market (ADGM)', multiplier: 1.22, tier: 'Tier 1 Tech Hub' }
        ]
      }
    ]
  },
  {
    name: 'Switzerland',
    code: 'CHE',
    flag: '🇨🇭',
    currency: 'CHF',
    currencySymbol: 'CHF',
    baseSalaryMultiplier: 1.15,
    states: [
      {
        name: 'Zurich (Zürich)',
        code: 'ZH',
        multiplier: 1.30,
        cities: [
          { name: 'Zurich City', multiplier: 1.40, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Geneva (Genève)',
        code: 'GE',
        multiplier: 1.24,
        cities: [
          { name: 'Geneva City', multiplier: 1.32, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Basel',
        code: 'BS',
        multiplier: 1.20,
        cities: [
          { name: 'Basel (BioTech / Pharma)', multiplier: 1.28, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'Japan',
    code: 'JPN',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    baseSalaryMultiplier: 0.64,
    states: [
      {
        name: 'Tokyo Prefecture',
        code: 'TYO',
        multiplier: 1.24,
        cities: [
          { name: 'Tokyo (Roppongi / Shibuya / Shinjuku)', multiplier: 1.30, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Osaka Prefecture',
        code: 'OSA',
        multiplier: 1.05,
        cities: [
          { name: 'Osaka City', multiplier: 1.10, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'Netherlands',
    code: 'NLD',
    flag: '🇳🇱',
    currency: 'EUR',
    currencySymbol: '€',
    baseSalaryMultiplier: 0.74,
    states: [
      {
        name: 'North Holland',
        code: 'NH',
        multiplier: 1.20,
        cities: [
          { name: 'Amsterdam', multiplier: 1.26, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'North Brabant',
        code: 'NB',
        multiplier: 1.15,
        cities: [
          { name: 'Eindhoven (Brainport / ASML Hub)', multiplier: 1.24, tier: 'Tier 1 Tech Hub' }
        ]
      }
    ]
  },
  {
    name: 'Ireland',
    code: 'IRL',
    flag: '🇮🇪',
    currency: 'EUR',
    currencySymbol: '€',
    baseSalaryMultiplier: 0.76,
    states: [
      {
        name: 'Dublin',
        code: 'DUB',
        multiplier: 1.22,
        cities: [
          { name: 'Dublin (Silicon Docks)', multiplier: 1.28, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Cork',
        code: 'CRK',
        multiplier: 1.05,
        cities: [
          { name: 'Cork City', multiplier: 1.10, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'France',
    code: 'FRA',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    baseSalaryMultiplier: 0.68,
    states: [
      {
        name: 'Île-de-France',
        code: 'IDF',
        multiplier: 1.22,
        cities: [
          { name: 'Paris (Station F)', multiplier: 1.26, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Auvergne-Rhône-Alpes',
        code: 'ARA',
        multiplier: 1.04,
        cities: [
          { name: 'Lyon', multiplier: 1.08, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'Sweden',
    code: 'SWE',
    flag: '🇸🇪',
    currency: 'SEK',
    currencySymbol: 'kr',
    baseSalaryMultiplier: 0.72,
    states: [
      {
        name: 'Stockholm County',
        code: 'AB',
        multiplier: 1.18,
        cities: [
          { name: 'Stockholm (Kista Science City)', multiplier: 1.24, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Västra Götaland',
        code: 'VG',
        multiplier: 1.06,
        cities: [
          { name: 'Gothenburg', multiplier: 1.10, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'Saudi Arabia',
    code: 'SAU',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR',
    baseSalaryMultiplier: 0.74,
    states: [
      {
        name: 'Riyadh Province',
        code: 'RYD',
        multiplier: 1.20,
        cities: [
          { name: 'Riyadh (KAFD / Tech District)', multiplier: 1.28, tier: 'Tier 1 Tech Hub' }
        ]
      },
      {
        name: 'Eastern Province',
        code: 'EAS',
        multiplier: 1.14,
        cities: [
          { name: 'Dhahran / Khobar (Aramco Hub)', multiplier: 1.22, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'South Korea',
    code: 'KOR',
    flag: '🇰🇷',
    currency: 'KRW',
    currencySymbol: '₩',
    baseSalaryMultiplier: 0.65,
    states: [
      {
        name: 'Seoul Capital Area',
        code: 'SEL',
        multiplier: 1.20,
        cities: [
          { name: 'Seoul (Gangnam / Pangyo Techno Valley)', multiplier: 1.26, tier: 'Tier 1 Tech Hub' }
        ]
      }
    ]
  },
  {
    name: 'Malaysia',
    code: 'MYS',
    flag: '🇲🇾',
    currency: 'MYR',
    currencySymbol: 'RM',
    baseSalaryMultiplier: 0.35,
    states: [
      {
        name: 'Kuala Lumpur / Selangor',
        code: 'KUL',
        multiplier: 1.15,
        cities: [
          { name: 'Kuala Lumpur (Cyberjaya / Bangsar)', multiplier: 1.22, tier: 'Tier 1 Tech Hub' },
          { name: 'Penang (Silicon Island)', multiplier: 1.12, tier: 'Tier 2 Major Metro' }
        ]
      }
    ]
  },
  {
    name: 'Brazil',
    code: 'BRA',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    baseSalaryMultiplier: 0.36,
    states: [
      {
        name: 'São Paulo',
        code: 'SP',
        multiplier: 1.20,
        cities: [
          { name: 'São Paulo (Faria Lima / Berrini)', multiplier: 1.25, tier: 'Tier 1 Tech Hub' },
          { name: 'Campinas (Unicamp Tech Hub)', multiplier: 1.10, tier: 'Emerging Tech Center' }
        ]
      }
    ]
  },
  {
    name: 'South Africa',
    code: 'ZAF',
    flag: '🇿🇦',
    currency: 'ZAR',
    currencySymbol: 'R',
    baseSalaryMultiplier: 0.38,
    states: [
      {
        name: 'Gauteng',
        code: 'GT',
        multiplier: 1.14,
        cities: [
          { name: 'Johannesburg (Sandton)', multiplier: 1.18, tier: 'Tier 1 Tech Hub' },
          { name: 'Pretoria', multiplier: 1.05, tier: 'Standard Metro' }
        ]
      },
      {
        name: 'Western Cape',
        code: 'WC',
        multiplier: 1.16,
        cities: [
          { name: 'Cape Town (Silicon Cape)', multiplier: 1.22, tier: 'Tier 1 Tech Hub' }
        ]
      }
    ]
  }
]

/**
 * Currency Formatting Utility
 * Handles standard international currency formatting as well as Indian LPA (Lakhs Per Annum)
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  options?: {
    useLpaForInr?: boolean
    compact?: boolean
    hideSymbol?: boolean
  }
): string {
  const currency = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD
  const useLpa = options?.useLpaForInr !== false && currency.code === 'INR'

  if (useLpa) {
    const lakhs = amount / 100000
    if (lakhs >= 100) {
      const crores = lakhs / 100
      return `${options?.hideSymbol ? '' : '₹'}${crores.toFixed(2)} Cr`
    }
    return `${options?.hideSymbol ? '' : '₹'}${lakhs.toFixed(1)} LPA`
  }

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: options?.hideSymbol ? 'decimal' : 'currency',
      currency: currency.code,
      maximumFractionDigits: options?.compact ? 0 : 0
    })
    return formatter.format(Math.round(amount))
  } catch {
    return `${currency.symbol}${Math.round(amount).toLocaleString('en-US')}`
  }
}

/**
 * Converts an amount from one currency to another using the live/market rates table
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount
  const fromRate = CURRENCY_RATES[fromCurrency]?.rateToUSD || 1.0
  const toRate = CURRENCY_RATES[toCurrency]?.rateToUSD || 1.0

  const usdAmount = amount / fromRate
  return usdAmount * toRate
}

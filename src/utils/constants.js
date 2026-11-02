export const ratings = [
  {

    id: 1,
    value: 'All'
  },
  {
    id: 2,
    value: '3.0-3.5'
  },
  {
    id: 3,
    value: '3.5-4.0'
  },
  {
    id: 4,
    value: '4.0-4.5'
  },
  {
    id: 5,
    value: '4.5-5.0'
  }
]

export const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
];

// Subscription packages for healthcare providers
export const subscriptionPackages = [
  {
    id: 'premium-agency',
    name: 'Agency Plan',
    price: 49.99,
    period: 'month',
    type: 'agency', // Added type field
    features: [
      'Apply for jobs & accept invitations',
      'Direct messaging with patients',
      'Complete profile access',
      'Job application tracking',
    ],
    popular: false,
    commission: 15, // Higher commission rate for agency
    description: 'Full access with 15% commission on completed jobs'
  },  
  {
    id: 'premium-individual',
    name: 'Individual Plan',
    price: 19.99,
    period: 'month',
    type: 'individual', // Added type field
    features: [
      'Apply for jobs & accept invitations',
      'Direct messaging with patients',
      'Complete profile access',
      'Job application tracking',
    ],
    popular: false,
    commission: 8, // Lowest commission rate for basic
    description: 'Full access with 8% commission on completed jobs'
  }
];

// Utility function to get subscription package by ID
export const getSubscriptionPackageById = (packageId) => {
  return subscriptionPackages.find(pkg => pkg.id === packageId);
};

// Utility function to get popular package
export const getPopularPackage = () => {
  return subscriptionPackages.find(pkg => pkg.popular === true);
};

export const hourlyRateOptions = [
  "$0 - $20",
  "$20 - $50",
  "$50 - $100",
  "$100 - $200",
  "$200+"
];

export const typeOfCareOptions = [
  { key: "personalCare", label: "Personal Care (Daily Living Assistance)" },
  { key: "medicalCare", label: "Medical Care (Clinical & Nursing)" },
  { key: "alzheimersDementiaCare", label: "Alzheimer's & Dementia Care" },
  { key: "elderlyCare", label: "Elderly Care (Geriatric Care)" },
  { key: "respiteCare", label: "Respite Care (Short-term Relief for Caregivers)" },
  { key: "rehabilitationCare", label: "Rehabilitation Care (Post-surgery, Injury, Stroke)" },
  { key: "postHospitalizationCare", label: "Post-Hospitalization Care" },
  { key: "maternityNewbornCare", label: "Maternity & Newborn Care" },
  { key: "childPediatricCare", label: "Child Care & Pediatric Support" },
  { key: "disabilitySpecialNeedsCare", label: "Disability & Special Needs Care" },
  { key: "homeNursingServices", label: "Home Nursing Services" },
];
export const genderOptions = [
  "male",
  "female",
  "other",
];
export const specificSpecializationOptions = [
  "Allergist",
  "Andrologist",
  "Diabetologist",
  "Pain Management Specialist",
  "Sleep Specialist",
];
//   export const specificSpecializationOptions = [
//   'General Medicine',
//   'Cardiology',
//   'Neurology',
//   'Pediatrics',
//   'Orthopedics',
//   'Dermatology',
//   'Psychiatry',
//   'Gynecology',
//   'Oncology',
//   'Urology',
//   'Ophthalmology',
//   'ENT',
//   'Diabetologist',
//   'Andrologist'
// ];
export const locations = [
  "Florence",
  "Alexander City",
  "Andalusia",
  "Birmingham",
  "Ozark",
];
export const prices = [
  { key: "0-100", label: "$0 - $100" },
  { key: "101-200", label: "$101 - $200" },
  { key: "201-300", label: "$201 - $300" },
  { key: "301-400", label: "$301 - $400" },
  { key: "401-500", label: "$401 - $500" },
  { key: "above-500", label: "Above $500" },
];

export const menuItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Find Jobs", path: "/dashboard/find-jobs" },
  { label: "My Jobs", path: "/dashboard/my-jobs" },
  // { label: "Job Offers", path: "/dashboard/job-offers" },
];

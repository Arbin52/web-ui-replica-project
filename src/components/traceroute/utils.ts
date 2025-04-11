
export const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

export const generateGeoLocation = () => {
  const countries = ['United States', 'Germany', 'Japan', 'United Kingdom', 'Canada', 'France', 'Australia'];
  const cities = {
    'United States': ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Miami'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka', 'Sapporo'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  };
  
  const country = countries[Math.floor(Math.random() * countries.length)];
  const citiesForCountry = cities[country as keyof typeof cities];
  const city = citiesForCountry[Math.floor(Math.random() * citiesForCountry.length)];
  
  return { country, city };
};

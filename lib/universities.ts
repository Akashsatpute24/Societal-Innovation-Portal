export interface Institution {
  id: string;
  name: string;
  shortName: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  departments: string[];
  specializations: string[];
}

export const UNIVERSITY_REGISTRY: Institution[] = [
  // Existing & Regional Anchors
  {
    id: 'bit-mesra',
    name: 'Birla Institute of Technology (BIT), Mesra',
    shortName: 'BIT Mesra',
    state: 'Jharkhand',
    region: 'East',
    departments: ['Environmental Science & Engineering', 'Civil Engineering', 'Remote Sensing'],
    specializations: ['Water Harvesting', 'Mining Environmental Impacts', 'GIS Land Mapping']
  },
  {
    id: 'nit-jamshedpur',
    name: 'National Institute of Technology (NIT), Jamshedpur',
    shortName: 'NIT Jamshedpur',
    state: 'Jharkhand',
    region: 'East',
    departments: ['Metallurgical & Materials Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    specializations: ['Industrial Waste Utilization', 'Heavy Machinery', 'Structural Road Materials']
  },
  {
    id: 'iit-isravan',
    name: 'Indian Institute of Technology (ISM), Dhanbad',
    shortName: 'IIT (ISM) Dhanbad',
    state: 'Jharkhand',
    region: 'East',
    departments: ['Mining Engineering', 'Environmental Engineering', 'Applied Geology'],
    specializations: ['Groundwater Heavy Metal Contamination', 'Soil Degradation', 'Sub-surface Hydrology']
  },

  // East & Northeast Region
  {
    id: 'iit-kharagpur',
    name: 'Indian Institute of Technology (IIT), Kharagpur',
    shortName: 'IIT Kharagpur',
    state: 'West Bengal',
    region: 'East',
    departments: ['Agricultural & Food Engineering', 'Civil Engineering'],
    specializations: ['Post-Harvest Off-Grid Cold Storage', 'Saline Soil Bio-Char', 'Precision Agritech']
  },
  {
    id: 'nit-durgapur',
    name: 'National Institute of Technology (NIT), Durgapur',
    shortName: 'NIT Durgapur',
    state: 'West Bengal',
    region: 'East',
    departments: ['Chemical Engineering', 'Biotechnology'],
    specializations: ['Industrial Effluent Treatment', 'Micro-Algae Bio-Remediation']
  },
  {
    id: 'iit-guwahati',
    name: 'Indian Institute of Technology (IIT), Guwahati',
    shortName: 'IIT Guwahati',
    state: 'Assam',
    region: 'Northeast',
    departments: ['Design', 'Civil Engineering', 'Chemical Engineering'],
    specializations: ['Monsoon Siltation & Urban Flooding', 'Bamboo Composite Materials', 'Rural Diagnostic Kits']
  },

  // North Region
  {
    id: 'iit-roorkee',
    name: 'Indian Institute of Technology (IIT), Roorkee',
    shortName: 'IIT Roorkee',
    state: 'Uttarakhand',
    region: 'North',
    departments: ['Hydrology', 'Earthquake Engineering', 'Civil Engineering'],
    specializations: ['Hydro-geology', 'Landslide Early Warning', 'Polymer & Self-Healing Asphalt']
  },
  {
    id: 'iit-mandi',
    name: 'Indian Institute of Technology (IIT), Mandi',
    shortName: 'IIT Mandi',
    state: 'Himachal Pradesh',
    region: 'North',
    departments: ['School of Engineering', 'School of Computing'],
    specializations: ['High-Altitude Thermal Insulation', 'Cloudburst Detection', 'Cold-Weather Pipe Freezing']
  },
  {
    id: 'pau-ludhiana',
    name: 'Punjab Agricultural University (PAU), Ludhiana',
    shortName: 'PAU Ludhiana',
    state: 'Punjab',
    region: 'North',
    departments: ['Soil Science', 'Farm Machinery & Power Engineering'],
    specializations: ['Stubble Management & Bio-Briquettes', 'Precision Irrigation', 'Groundwater Depletion']
  },
  {
    id: 'dtu-delhi',
    name: 'Delhi Technological University (DTU), Delhi',
    shortName: 'DTU',
    state: 'Delhi',
    region: 'North',
    departments: ['Environmental Engineering', 'Mechanical Engineering'],
    specializations: ['Particulate Matter Monitoring', 'Vector-Borne Disease Control', 'Sewer Inspection Robotics']
  },
  {
    id: 'iari-pusa',
    name: 'Indian Agricultural Research Institute (IARI Pusa), Delhi',
    shortName: 'IARI Pusa',
    state: 'Delhi',
    region: 'North',
    departments: ['Agronomy', 'Agricultural Chemicals'],
    specializations: ['Pest-Resistant Bio-Pesticides', 'Bio-Decomposers', 'Soil Fertility Spectrography']
  },

  // West Region
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology (IIT), Bombay',
    shortName: 'IIT Bombay',
    state: 'Maharashtra',
    region: 'West',
    departments: ['Centre for Environmental Science and Engineering (CESE)', 'Civil Engineering'],
    specializations: ['Desalination & Marine Coastal Systems', 'Micro-Plastic Filtration', 'Urban Flash Flooding']
  },
  {
    id: 'ict-mumbai',
    name: 'Institute of Chemical Technology (ICT), Mumbai',
    shortName: 'ICT Mumbai',
    state: 'Maharashtra',
    region: 'West',
    departments: ['Chemical Engineering', 'Polymer & Surface Engineering'],
    specializations: ['Industrial Effluent & Textile Dyes', 'Bio-Degradable Packaging Materials']
  },
  {
    id: 'coep-pune',
    name: 'COEP Technological University, Pune',
    shortName: 'COEP Pune',
    state: 'Maharashtra',
    region: 'West',
    departments: ['Manufacturing Engineering', 'Mechatronics'],
    specializations: ['Ergonomic Labour Exoskeletons', 'IoT Water Quality Sensors', 'Low-Cost Prototyping']
  },
  {
    id: 'mnit-jaipur',
    name: 'Malaviya National Institute of Technology (MNIT), Jaipur',
    shortName: 'MNIT Jaipur',
    state: 'Rajasthan',
    region: 'West',
    departments: ['Centre for Energy and Environment', 'Civil Engineering'],
    specializations: ['Passive Building Cooling Materials', 'Arid Zone Solar Evaporative Cooling']
  },
  {
    id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science (BITS), Pilani',
    shortName: 'BITS Pilani',
    state: 'Rajasthan',
    region: 'West',
    departments: ['Chemical Engineering', 'Electrical & Electronics Engineering'],
    specializations: ['Smart Village Water Metering', 'Micro-Grid Energy Systems', 'Point-of-Care Diagnostics']
  },

  // South Region
  {
    id: 'iit-madras',
    name: 'Indian Institute of Technology (IIT), Madras',
    shortName: 'IIT Madras',
    state: 'Tamil Nadu',
    region: 'South',
    departments: ['Building Technology & Construction', 'Biomedical Engineering'],
    specializations: ['Zero-Electricity Water Desalination', 'Affordable Diagnostic Hardware', 'Wastewater Recycling']
  },
  {
    id: 'nitk-surathkal',
    name: 'National Institute of Technology Karnataka (NITK), Surathkal',
    shortName: 'NITK Surathkal',
    state: 'Karnataka',
    region: 'South',
    departments: ['Applied Mechanics & Hydraulics', 'Civil Engineering'],
    specializations: ['Coastal Erosion Barriers', 'High-Rainfall Bituminous Asphalt', 'Marine Hydraulic Structures']
  },
  {
    id: 'tnau-coimbatore',
    name: 'Tamil Nadu Agricultural University (TNAU), Coimbatore',
    shortName: 'TNAU Coimbatore',
    state: 'Tamil Nadu',
    region: 'South',
    departments: ['Soil & Water Conservation', 'Agronomy'],
    specializations: ['Precision Agritech & Pest Sensing', 'Alkaline Soil Degradation', 'Drone Spraying']
  },
  {
    id: 'vit-vellore',
    name: 'Vellore Institute of Technology (VIT), Vellore',
    shortName: 'VIT Vellore',
    state: 'Tamil Nadu',
    region: 'South',
    departments: ['Biomedical Sciences', 'Centre for Clean Energy'],
    specializations: ['Low-Cost Prosthetics', 'Heavy Metal Extraction Filters', 'Solar Water Purification']
  },
  {
    id: 'nit-warangal',
    name: 'National Institute of Technology (NIT), Warangal',
    shortName: 'NIT Warangal',
    state: 'Telangana',
    region: 'South',
    departments: ['Civil Engineering', 'Materials Science'],
    specializations: ['Plastic-Modified Road Asphalt', 'Rural Rainwater Harvesting Networks']
  },
  {
    id: 'iisc-bengaluru',
    name: 'Indian Institute of Science (IISc), Bengaluru',
    shortName: 'IISc Bengaluru',
    state: 'Karnataka',
    region: 'South',
    departments: ['Centre for Sustainable Technologies (CST)', 'Civil Engineering'],
    specializations: ['Decentralized Sanitation', 'Structural Health Sensor Networks', 'Bio-Gas Generators']
  },

  // Central Region
  {
    id: 'iit-indore',
    name: 'Indian Institute of Technology (IIT), Indore',
    shortName: 'IIT Indore',
    state: 'Madhya Pradesh',
    region: 'Central',
    departments: ['Astronomy, Astrophysics and Space Engineering', 'Mechanical Engineering'],
    specializations: ['Smart Agriculture Sensors', 'Micro-Hydro Turbine Design']
  },
  {
    id: 'manit-bhopal',
    name: 'Maulana Azad National Institute of Technology (MANIT), Bhopal',
    shortName: 'MANIT Bhopal',
    state: 'Madhya Pradesh',
    region: 'Central',
    departments: ['Water Resources Engineering', 'Civil Engineering'],
    specializations: ['Catchment Basin Management', 'Rural Waste-to-Energy Processing']
  }
];
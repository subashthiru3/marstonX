// Mock data for the Fleet Incident Transparency application

export const mockVehicles = [
  {
    id: 1,
    vehicleNumber: 'FL-001',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    licensePlate: 'ABC-1234',
    status: 'Active',
    lastMaintenance: '2024-08-15',
    assignedOfficer: 'John Doe'
  },
  {
    id: 2,
    vehicleNumber: 'FL-002',
    make: 'Chevrolet',
    model: 'Silverado',
    year: 2023,
    licensePlate: 'DEF-5678',
    status: 'Active',
    lastMaintenance: '2024-09-01',
    assignedOfficer: 'Jane Smith'
  },
  {
    id: 3,
    vehicleNumber: 'FL-003',
    make: 'Toyota',
    model: 'Tacoma',
    year: 2021,
    licensePlate: 'GHI-9012',
    status: 'Maintenance',
    lastMaintenance: '2024-09-10',
    assignedOfficer: 'Bob Johnson'
  },
  {
    id: 4,
    vehicleNumber: 'FL-004',
    make: 'GMC',
    model: 'Sierra',
    year: 2023,
    licensePlate: 'JKL-3456',
    status: 'Active',
    lastMaintenance: '2024-08-20',
    assignedOfficer: 'Alice Brown'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@fleet.com',
    role: 'user',
    department: 'Traffic Enforcement',
    status: 'Active',
    joinDate: '2023-01-15',
    incidentsCount: 3
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@fleet.com',
    role: 'user',
    department: 'Highway Patrol',
    status: 'Active',
    joinDate: '2022-11-20',
    incidentsCount: 5
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@fleet.com',
    role: 'user',
    department: 'Traffic Enforcement',
    status: 'Active',
    joinDate: '2023-03-10',
    incidentsCount: 2
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@fleet.com',
    role: 'user',
    department: 'Highway Patrol',
    status: 'Active',
    joinDate: '2022-08-05',
    incidentsCount: 7
  },
  {
    id: 5,
    name: 'Admin User',
    email: 'admin@fleet.com',
    role: 'admin',
    department: 'Administration',
    status: 'Active',
    joinDate: '2022-01-01',
    incidentsCount: 0
  }
];

export const mockIncidents = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    vehicleId: 1,
    vehicleNumber: 'FL-001',
    incidentType: 'Traffic Violation',
    description: 'Speeding violation on Highway 101',
    location: 'Highway 101, Mile Marker 45',
    date: '2024-09-05',
    time: '14:30',
    severity: 'Medium',
    status: 'Resolved',
    reportedBy: 'John Doe',
    approvedBy: 'Admin User',
    notes: 'Warning issued, driver education recommended'
  },
  {
    id: 2,
    userId: 1,
    userName: 'John Doe',
    vehicleId: 1,
    vehicleNumber: 'FL-001',
    incidentType: 'Vehicle Damage',
    description: 'Minor fender damage from parking incident',
    location: 'Station Parking Lot',
    date: '2024-08-28',
    time: '09:15',
    severity: 'Low',
    status: 'Under Review',
    reportedBy: 'John Doe',
    approvedBy: null,
    notes: 'Awaiting insurance assessment'
  },
  {
    id: 3,
    userId: 2,
    userName: 'Jane Smith',
    vehicleId: 2,
    vehicleNumber: 'FL-002',
    incidentType: 'Equipment Failure',
    description: 'Radar gun malfunction during routine check',
    location: 'Field Office',
    date: '2024-09-08',
    time: '11:00',
    severity: 'Low',
    status: 'Resolved',
    reportedBy: 'Jane Smith',
    approvedBy: 'Admin User',
    notes: 'Equipment replaced, maintenance scheduled'
  },
  {
    id: 4,
    userId: 3,
    userName: 'Bob Johnson',
    vehicleId: 3,
    vehicleNumber: 'FL-003',
    incidentType: 'Traffic Accident',
    description: 'Rear-end collision at intersection',
    location: 'Main St & Oak Ave',
    date: '2024-09-03',
    time: '16:45',
    severity: 'High',
    status: 'Under Investigation',
    reportedBy: 'Bob Johnson',
    approvedBy: null,
    notes: 'Police report filed, witness statements collected'
  },
  {
    id: 5,
    userId: 4,
    userName: 'Alice Brown',
    vehicleId: 4,
    vehicleNumber: 'FL-004',
    incidentType: 'Medical Emergency',
    description: 'Officer required medical attention after foot pursuit',
    location: 'Downtown District',
    date: '2024-09-01',
    time: '20:30',
    severity: 'High',
    status: 'Resolved',
    reportedBy: 'Alice Brown',
    approvedBy: 'Admin User',
    notes: 'Medical leave approved, light duty assigned'
  }
];

// Helper functions for data management
export const getIncidentsByUser = (userId) => {
  return mockIncidents.filter(incident => incident.userId === userId);
};

export const getVehicleById = (vehicleId) => {
  return mockVehicles.find(vehicle => vehicle.id === vehicleId);
};

export const getUserById = (userId) => {
  return mockUsers.find(user => user.id === userId);
};

// Simulate localStorage persistence for new incidents
export const saveIncident = (incident) => {
  const savedIncidents = JSON.parse(localStorage.getItem('fleet-incidents') || '[]');
  const newIncident = {
    ...incident,
    id: Date.now(), // Simple ID generation
    status: 'Pending',
    approvedBy: null
  };
  savedIncidents.push(newIncident);
  localStorage.setItem('fleet-incidents', JSON.stringify(savedIncidents));
  return newIncident;
};

export const getSavedIncidents = (userId) => {
  const savedIncidents = JSON.parse(localStorage.getItem('fleet-incidents') || '[]');
  return savedIncidents.filter(incident => incident.userId === userId);
};

export const updateIncident = (incidentId, updates) => {
  const savedIncidents = JSON.parse(localStorage.getItem('fleet-incidents') || '[]');
  const index = savedIncidents.findIndex(incident => incident.id === incidentId);
  if (index !== -1) {
    savedIncidents[index] = { ...savedIncidents[index], ...updates };
    localStorage.setItem('fleet-incidents', JSON.stringify(savedIncidents));
    return savedIncidents[index];
  }
  return null;
};

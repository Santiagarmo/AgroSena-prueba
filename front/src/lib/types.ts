export interface Employee {
  id: string;
  name: string;
  card: string; // Cedula or ID number
  role: string;
  contact: string;
}

export interface Equipment {
  id: string;
  reference: string;
  status: 'bueno' | 'necesita_mantenimiento' | 'fuera_de_servicio';
  purchaseDate: Date;
  name: string; // Added name for easier identification
}

export interface PlantingRecord {
  id: string;
  cropName: string;
  plantingDate: Date;
  inputsUsed: string;
  quantity: string; // Kept as string for flexibility e.g., "10 acres", "500 units"
  location: string;
  photo?: string; // Data URL for image preview
  photoFileName?: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'contract' | 'payroll' | 'other';
  uploadDate: Date;
  file?: File; // Store the actual file object transiently for upload
  fileName?: string;
  fileSize?: number;
}

// Add other types as needed

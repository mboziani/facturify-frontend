// Client entity matching backend structure
export interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    contactPerson?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    vatNumber?: string;
    companyRegistration?: string;
    notes?: string;
    isActive: boolean;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

// Data for creating a new client
export interface CreateClientData {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    contactPerson?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    vatNumber?: string;
    companyRegistration?: string;
    notes?: string;
    companyId: string;
}

// Data for updating a client (all fields optional except id)
export interface UpdateClientData {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    contactPerson?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    vatNumber?: string;
    companyRegistration?: string;
    notes?: string;
}

// Filters for client list
export interface ClientFilters {
    companyId: string;
    search?: string;
}

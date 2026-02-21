export interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    type: "personal" | "professional";
}

const STORAGE_KEY = "local_address_db";

const initialData: Address[] = [
    {
        id: "1",
        name: "John Doe",
        street: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        type: "personal",
    },
    {
        id: "2",
        name: "Acme Corp",
        street: "456 Tech Park",
        city: "Bangalore",
        state: "Karnataka",
        zip: "560001",
        type: "professional",
    },
];

export const AddressDatabase = {
    // Initialize DB with dummy data if empty
    init: () => {
        const existingData = localStorage.getItem(STORAGE_KEY);
        if (!existingData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
    },

    // Fetch all addresses
    getAll: (): Address[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data) as Address[];
        } catch {
            return [];
        }
    },

    // Add a new address
    add: (address: Omit<Address, "id">): Address => {
        const currentData = AddressDatabase.getAll();
        const newAddress = { ...address, id: Date.now().toString() };
        const updatedData = [...currentData, newAddress];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        return newAddress;
    },

    // Delete an address
    delete: (id: string): void => {
        const currentData = AddressDatabase.getAll();
        const updatedData = currentData.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    },
};

import React, { useState, useEffect } from "react";
import { AddressDatabase, type Address } from "./database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Trash2, Home } from "lucide-react";

const AddressList: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        // Initialize DB with dummy data if empty, then fetch.
        AddressDatabase.init();
        refreshAddresses();
    }, []);

    const refreshAddresses = () => {
        setAddresses(AddressDatabase.getAll());
    };

    const handleDelete = (id: string) => {
        AddressDatabase.delete(id);
        refreshAddresses();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                        Local Storage Address Map
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Fetching data directly from your local JSON storage database and mapping into the app component format.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No Address Data Found in Local Storage.
                    </div>
                ) : (
                    addresses.map((address) => (
                        <Card key={address.id} className="relative overflow-hidden group shadow-md hover:shadow-lg transition-all animate-fade-in border-border/50 bg-card rounded-2xl">
                            <div className="absolute top-0 right-0 p-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(address.id)}
                                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${address.type === 'personal' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {address.type === 'personal' ? <Home className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{address.name}</CardTitle>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            {address.type} address
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-start gap-3 text-muted-foreground mt-4">
                                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state}</p>
                                        <p>{address.zip}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressList;

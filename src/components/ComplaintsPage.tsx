import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Clock, FileText, CheckCircle, Mail } from "lucide-react";
import { getComplaintsForUser } from "@/api/complaintsService";
import type { StoredComplaint } from "@/api/complaintsService";
import type { User as UserType } from "@/types/auth";

interface ComplaintsPageProps {
    onBack: () => void;
    currentUser: UserType | null;
}

export default function ComplaintsPage({ onBack, currentUser }: ComplaintsPageProps) {
    const [complaints, setComplaints] = useState<StoredComplaint[]>([]);

    useEffect(() => {
        if (currentUser?.id) {
            setComplaints(getComplaintsForUser(currentUser.id));
        }
    }, [currentUser]);

    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-secondary">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-xl font-semibold">My Complaints</h1>
                        </div>
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={onBack}
                        >
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold hidden sm:inline group-hover:text-primary transition-colors">FixMyArea</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="flex-1 py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            Sent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Reports</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Track the status of all your submitted community issues.
                        </p>
                    </div>

                    {complaints.length === 0 ? (
                        <Card className="bg-card/60 backdrop-blur-sm border-border border-2 rounded-xl text-center p-12 animate-fade-in">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No complaints sent yet</h3>
                            <p className="text-muted-foreground mb-6">When you report an issue, it will appear here.</p>
                            <Button onClick={onBack} className="btn-primary">
                                Start a Report
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {complaints.map((complaint, index) => (
                                <Card
                                    key={complaint.id}
                                    className="relative bg-card/80 backdrop-blur-sm border-border border-2 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in group overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Sent
                                                </Badge>
                                                {complaint.status === "completed" ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600 border-transparent text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Completed
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/30">
                                                        <Clock className="w-3 h-3 mr-1" /> Pending
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(complaint.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {complaint.subject}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                            {complaint.body}
                                        </div>

                                        <div className="flex items-center gap-2 pt-4 border-t border-border/50 text-sm">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span className="font-medium">Sent to: </span>
                                            <span className="text-muted-foreground">{complaint.recipient}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

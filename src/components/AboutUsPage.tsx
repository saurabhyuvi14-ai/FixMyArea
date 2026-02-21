import { Camera, MapPin, Zap, FileText, ArrowLeft, Shield, Globe, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { User as UserType } from "@/types/auth";

interface AboutUsPageProps {
    onBack: () => void;
    onStartReporting: () => void;
    currentUser: UserType | null;
}

export default function AboutUsPage({ onBack, onStartReporting, currentUser }: AboutUsPageProps) {
    const features = [
        {
            icon: Camera,
            title: "Snap & Upload",
            description: "Take a photo of any civic issue and upload it instantly. Our AI will analyze the image.",
        },
        {
            icon: MapPin,
            title: "Auto Location",
            description: "We automatically detect your location using GPS to pinpoint the exact problem area.",
        },
        {
            icon: Zap,
            title: "AI Analysis",
            description: "Our AI identifies the issue type, severity, and provides actionable insights.",
        },
        {
            icon: FileText,
            title: "Smart Complaint",
            description: "Generate a professional, formatted complaint ready to send to authorities.",
        },
    ];

    const benefits = [
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your data is encrypted and never shared with third parties.",
        },
        {
            icon: Globe,
            title: "Works Everywhere",
            description: "Available in all cities and regions with location support.",
        },
        {
            icon: CheckCircle,
            title: "Free to Use",
            description: "No hidden fees or subscriptions. Completely free for citizens.",
        },
        {
            icon: AlertTriangle,
            title: "Real Impact",
            description: "Join thousands of citizens making their communities better.",
        },
    ];

    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={onBack} size="sm" className="hover:bg-secondary">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
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
            <section className="flex-1 py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Features</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to report and track civic issues in your community
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="relative bg-card/60 backdrop-blur-sm border-border border-2 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in group overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-6 relative z-10">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                        <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 lg:py-32 bg-gradient-to-b from-secondary/50 to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose FixMyArea?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We're committed to making civic reporting simple, effective, and accessible to everyone. Join the movement to improve your community.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12 max-w-4xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-5 animate-fade-in group hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${(index + 5) * 100}ms` }}>
                                <div className="w-14 h-14 bg-card border border-border sm:border-2 sm:border-border/50 shadow-sm rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 group-hover:shadow-md transition-all duration-300">
                                    <benefit.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{benefit.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-primary rounded-3xl p-8 sm:p-16 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                        </div>

                        <div className="relative text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                                Ready to Make a Difference?
                            </h2>
                            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                                Join thousands of citizens who are actively improving their communities. Start reporting issues today.
                            </p>
                            <Button
                                onClick={onStartReporting}
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <Camera className="w-5 h-5 mr-2" />
                                {currentUser ? "Report an Issue" : "Get Started"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

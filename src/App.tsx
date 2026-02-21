import { useState, useEffect } from "react";
import { Camera, MapPin, FileText, Send, Shield, Zap, ArrowRight, Loader2, RefreshCw, X, Upload, Mail, Copy, Check, LogOut, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { LocationData, IssueAnalysis, GeneratedComplaint } from "@/types";
import type { AuthPage, User as UserType } from "@/types/auth";
import { reverseGeocode, formatCoordinates, getBase64 } from "@/lib/utils";
import { analyzeImage, generateComplaint } from "@/api/aiService";
import { isAuthenticated, getCurrentUser, logoutUser } from "@/api/authService";
import { cn } from "@/lib/utils";
import LoginPage from "@/components/auth/LoginPage";
import SignupPage from "@/components/auth/SignupPage";
import VerifyOTPPage from "@/components/auth/VerifyOTPPage";
import CreateProfilePage from "@/components/auth/CreateProfilePage";
import AddressList from "./local-address/AddressList";
import AboutUsPage from "@/components/AboutUsPage";
import ComplaintsPage from "@/components/ComplaintsPage";
import { saveComplaint } from "@/api/complaintsService";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState<AuthPage>("landing");
  const [signupEmail, setSignupEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // Check auth status on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setCurrentPage("landing");
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  const handleSignupEmailSubmitted = (email: string) => {
    setSignupEmail(email);
    setCurrentPage("verify-otp");
  };

  const handleOTPVerified = () => {
    setCurrentPage("create-profile");
  };

  const handleProfileCreated = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setCurrentPage("landing");
  };

  const handleStartReporting = () => {
    if (isAuthenticated()) {
      setCurrentPage("report");
    } else {
      setCurrentPage("login");
    }
  };

  // Render current page
  switch (currentPage) {
    case "login":
      return (
        <LoginPage
          onLogin={handleLogin}
          onBack={() => setCurrentPage("landing")}
          onGoToSignup={() => setCurrentPage("signup")}
        />
      );
    case "signup":
      return (
        <SignupPage
          onEmailSubmitted={handleSignupEmailSubmitted}
          onBack={() => setCurrentPage("landing")}
          onGoToLogin={() => setCurrentPage("login")}
        />
      );
    case "verify-otp":
      return (
        <VerifyOTPPage
          email={signupEmail}
          onVerified={handleOTPVerified}
          onBack={() => setCurrentPage("signup")}
        />
      );
    case "create-profile":
      return (
        <CreateProfilePage
          email={signupEmail}
          onProfileCreated={handleProfileCreated}
          onBack={() => setCurrentPage("verify-otp")}
        />
      );
    case "report":
      return (
        <ReportPage
          onBack={() => setCurrentPage("landing")}
          currentUser={currentUser}
          onComplaints={() => setCurrentPage("complaints")}
        />
      );
    case "local-address":
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <header className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setCurrentPage("landing")}>
                <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
                Back
              </Button>
            </div>
          </header>
          <div className="flex-1">
            <AddressList />
          </div>
        </div>
      );
    case "about-us":
      return (
        <AboutUsPage
          onBack={() => setCurrentPage("landing")}
          onStartReporting={handleStartReporting}
          currentUser={currentUser}
        />
      );
    case "complaints":
      return (
        <ComplaintsPage
          onBack={() => setCurrentPage("landing")}
          currentUser={currentUser}
        />
      );
    default:
      return (
        <LandingPage
          onStartReporting={handleStartReporting}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={() => setCurrentPage("login")}
          onAboutUs={() => setCurrentPage("about-us")}
          onComplaints={() => setCurrentPage("complaints")}
        />
      );
  }
}

// ==================== LANDING PAGE ====================
interface LandingPageProps {
  onStartReporting: () => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onLogin: () => void;
  onAboutUs: () => void;
  onComplaints: () => void;
}

function LandingPage({ onStartReporting, currentUser, onLogout, onLogin, onAboutUs, onComplaints }: LandingPageProps) {
  const steps = [

    {
      number: "01",
      title: "Take a Photo",
      description: "Capture the civic issue with your camera or upload an existing image.",
    },
    {
      number: "02",
      title: "Get Location",
      description: "Allow location access or manually enter the address of the issue.",
    },
    {
      number: "03",
      title: "AI Analysis",
      description: "Our AI analyzes the image and identifies the problem automatically.",
    },
    {
      number: "04",
      title: "Send Complaint",
      description: "Review and send the generated complaint to the relevant authorities.",
    },
  ];



  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                // Return to landing. We don't have setCurrentPage accessible from here directly in App without passing it, 
                // wait, the Nav is inside LandingPage! So we can use a prop or handle it. 
                // But wait, the Nav is in LandingPage! 
                // Ah, the URL or what? Currently LandingPage doesn't have a specific `onHome` prop. But a hard refresh `window.location.reload()` or similar works, or just pass simple callback. Better: `window.scrollTo({top: 0, behavior: 'smooth'})` if it's already landing page.
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">FixMyArea</span>
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={onComplaints}
                    className="text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    Complaints
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onAboutUs}
                    className="text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    About Us
                  </Button>
                  <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={onAboutUs}
                    className="text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    About Us
                  </Button>
                  <Button
                    onClick={onLogin}
                    variant="ghost"
                    className="text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button onClick={onStartReporting} className="btn-primary">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Civic Reporting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Report Local Issues <span className="gradient-text">Effortlessly</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in">
              FixMyArea uses AI to analyze photos, detect locations, and generate professional complaints.
              Make your community better with just a few clicks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center w-full animate-fade-in">
              <div className="flex-1 hidden sm:block"></div>
              <Button onClick={onStartReporting} size="lg" className="btn-primary text-lg px-8 py-6 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1">
                <Camera className="w-5 h-5 mr-2" />
                {currentUser ? "Report an Issue" : "Get Started"}
              </Button>
              <div className="flex-1 flex sm:justify-start sm:ml-8 mt-4 sm:mt-0">
                <button
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-lg px-8 py-6 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border animate-fade-in">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Issues Reported</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground mt-1">Resolution Rate</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to report any civic issue in your area
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
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
                className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90"
              >
                <Camera className="w-5 h-5 mr-2" />
                {currentUser ? "Report an Issue" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FixMyArea</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FixMyArea. Making communities better, one report at a time.
            </p>
            <div className="flex items-center gap-6">
              <button onClick={onStartReporting} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report Issue
              </button>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Terms
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ==================== REPORT PAGE ====================
interface ReportPageProps {
  onBack: () => void;
  currentUser: UserType | null;
  onComplaints: () => void;
}

function ReportPage({ onBack, currentUser, onComplaints }: ReportPageProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);
  const [complaint, setComplaint] = useState<GeneratedComplaint | null>(null);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingComplaint, setIsGeneratingComplaint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplaintSent, setIsComplaintSent] = useState(false);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Maximum size is 10MB");
      return;
    }

    try {
      const preview = await getBase64(file);
      setImage(file);
      setImagePreview(preview);
      setAnalysis(null);
      setComplaint(null);
      setError(null);
      setIsComplaintSent(false);
    } catch {
      setError("Failed to read image file");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setComplaint(null);
    setError(null);
  };

  // Detect location
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);

      setLocation({ latitude, longitude, address });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to detect location";
      setError(errorMessage);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  // Analyze image
  const handleAnalyzeImage = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(image);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate complaint
  const handleGenerateComplaint = async () => {
    if (!analysis || !location) {
      setError("Please complete image analysis and location detection first");
      return;
    }

    setIsGeneratingComplaint(true);
    setError(null);

    try {
      const result = await generateComplaint(
        analysis.issueType,
        location,
        analysis.description,
        analysis.severity
      );
      setComplaint(result);
    } catch (err) {
      setError("Failed to generate complaint. Please try again.");
    } finally {
      setIsGeneratingComplaint(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setComplaint(null);
    setError(null);
    setIsComplaintSent(false);
    detectLocation();
  };

  // Severity config
  const severityConfig = {
    low: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Low Priority" },
    medium: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Medium Priority" },
    high: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "High Priority" },
    critical: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Critical Priority" },
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-secondary">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Button>
              <h1 className="text-xl font-semibold">Report an Issue</h1>
            </div>
            <div className="flex items-center gap-4">
              {currentUser && (
                <Button
                  variant="ghost"
                  onClick={onComplaints}
                  className="text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  Complaints
                </Button>
              )}
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { label: "Upload", complete: !!image },
              { label: "Location", complete: !!location },
              { label: "Analysis", complete: !!analysis },
              { label: "Complaint", complete: !!complaint },
            ].map((step, index, array) => (
              <div key={index} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step.complete ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  {step.complete ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className={cn("ml-2 text-sm hidden sm:block", step.complete ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </span>
                {index < array.length - 1 && (
                  <div className={cn("w-8 sm:w-16 h-px mx-2 sm:mx-4", step.complete ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {isComplaintSent && (
          <Alert variant="default" className="mb-6 border-green-500/50 bg-green-500/10">
            <AlertTitle className="text-green-400">Success!</AlertTitle>
            <AlertDescription className="text-green-400/80">
              Your complaint has been generated successfully. You can now copy and send it to the relevant authorities.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Upload Photo
                </CardTitle>
                <CardDescription>Take a clear photo of the issue you want to report</CardDescription>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain rounded-lg bg-secondary" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="upload-zone rounded-lg p-8 text-center cursor-pointer block">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Drop your image here, or <span className="text-primary">browse</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Supports: JPEG, PNG, WebP (max 10MB)</p>
                  </label>
                )}

                {image && !analysis && (
                  <Button onClick={handleAnalyzeImage} disabled={isAnalyzing} className="w-full mt-4 btn-primary">
                    {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : "Analyze Issue"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
                <CardDescription>We&apos;ll use your current location to pinpoint the issue</CardDescription>
              </CardHeader>
              <CardContent>
                {isDetectingLocation ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                    <span className="text-muted-foreground">Detecting location...</span>
                  </div>
                ) : location ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{location.address}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatCoordinates(location.latitude, location.longitude)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={detectLocation} className="w-full" disabled={isDetectingLocation}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Location
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Unable to detect location automatically</p>
                    <Button onClick={detectLocation} disabled={isDetectingLocation} variant="outline">
                      {isDetectingLocation ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Trying...</> : "Try Again"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Analysis Result */}
            {isAnalyzing ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analyzing Image...</h3>
                  <p className="text-muted-foreground">Our AI is examining the photo to identify the issue type and severity</p>
                </CardContent>
              </Card>
            ) : analysis ? (
              <Card className="bg-card border-border animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        AI Analysis Result
                      </CardTitle>
                      <CardDescription>Our AI has analyzed the image and identified the issue</CardDescription>
                    </div>
                    <Badge variant="outline" className={cn("px-3 py-1", severityConfig[analysis.severity].color)}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {severityConfig[analysis.severity].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Issue Type</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{analysis.issueType}</p>
                        <p className="text-sm text-muted-foreground">Confidence: {Math.round(analysis.confidence * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                    <p className="text-foreground leading-relaxed">{analysis.description}</p>
                  </div>

                  {analysis.suggestedActions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggested Actions</h4>
                      <ul className="space-y-2">
                        {analysis.suggestedActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button onClick={handleGenerateComplaint} disabled={isGeneratingComplaint} className="w-full btn-primary">
                    {isGeneratingComplaint ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : "Generate Professional Complaint"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground">Upload a photo and click &quot;Analyze Issue&quot; to get AI-powered insights</p>
                </CardContent>
              </Card>
            )}

            {/* Generated Complaint */}
            {isGeneratingComplaint ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Generating Complaint...</h3>
                  <p className="text-muted-foreground">Creating a professional complaint based on the analysis</p>
                </CardContent>
              </Card>
            ) : complaint ? (
              <ComplaintCard
                complaint={complaint}
                onSend={() => {
                  setIsComplaintSent(true);
                  if (currentUser) {
                    saveComplaint(currentUser.id, complaint);
                  }
                }}
                isSent={isComplaintSent}
              />
            ) : null}
          </div>
        </div>

        {/* Reset Button */}
        {(image || analysis || complaint) && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={resetForm} className="mx-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Report
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

// ==================== COMPLAINT CARD COMPONENT ====================
interface ComplaintCardProps {
  complaint: GeneratedComplaint;
  onSend: () => void;
  isSent: boolean;
}

function ComplaintCard({ complaint, onSend, isSent }: ComplaintCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(complaint.fullComplaint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(complaint.subject);
    const body = encodeURIComponent(complaint.fullComplaint);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    onSend();
  };

  return (
    <Card className="bg-card border-border animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Generated Complaint
            </CardTitle>
            <CardDescription>Professional complaint ready to send to authorities</CardDescription>
          </div>
          <Badge variant="default" className="px-3 py-1 bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommended Recipient</h4>
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-medium">{complaint.recipient}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Subject Line</h4>
          <p className="font-medium p-3 bg-secondary/50 rounded-lg">{complaint.subject}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Complaint Body</h4>
          <div className="p-4 bg-secondary/30 rounded-lg max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{complaint.body}</pre>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            {copied ? <><Check className="w-4 h-4 mr-2 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy to Clipboard</>}
          </Button>
          <Button onClick={handleSendEmail} className="flex-1 btn-primary" disabled={isSent}>
            {isSent ? <><CheckCircle className="w-4 h-4 mr-2" /> Sent!</> : <><Send className="w-4 h-4 mr-2" /> Send via Email</>}
          </Button>
        </div>

        {isSent && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-400">Complaint Ready!</p>
                <p className="text-sm text-green-400/80">Your email client has been opened with the complaint pre-filled.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default App;

import type { LocationData, IssueAnalysis, GeneratedComplaint } from "@/types";

// OpenAI API Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Mock analysis for demo when no API key is available
const mockAnalysis = (): IssueAnalysis => {
  const issueTypes = [
    {
      issueType: "Road Damage",
      description: "Significant potholes and surface cracks visible on the road. The damage appears to be causing safety concerns for vehicles and pedestrians.",
      severity: "high" as const,
      suggestedActions: [
        "Contact Public Works Department immediately",
        "Place warning signs around the damaged area",
        "Schedule emergency road repair",
      ],
    },
    {
      issueType: "Garbage Accumulation",
      description: "Large piles of uncollected garbage and waste materials accumulated in a public area. This poses health and environmental risks.",
      severity: "medium" as const,
      suggestedActions: [
        "Notify sanitation department for immediate cleanup",
        "Investigate waste collection schedule disruption",
        "Install temporary waste bins if needed",
      ],
    },
    {
      issueType: "Water Leakage",
      description: "Visible water leakage from a damaged pipe or infrastructure. Water is pooling on the surface and may cause further damage.",
      severity: "critical" as const,
      suggestedActions: [
        "Contact water utility company immediately",
        "Shut off water supply if possible",
        "Document the extent of leakage",
      ],
    },
  ];

  const randomIssue = issueTypes[Math.floor(Math.random() * issueTypes.length)];
  
  return {
    ...randomIssue,
    confidence: 0.85 + Math.random() * 0.14,
  };
};

// Mock complaint generation
const mockComplaint = (
  issueType: string,
  location: LocationData,
  description: string,
  severity: string
): GeneratedComplaint => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recipientMap: Record<string, string> = {
    "Road Damage": "Public Works Department",
    "Garbage Accumulation": "Sanitation Department",
    "Water Leakage": "Water Utility Department",
    "Street Light Issue": "Municipal Electricity Board",
    "Traffic Signal Problem": "Traffic Management Authority",
    "Illegal Parking": "Traffic Police Department",
    "Graffiti/Vandalism": "Municipal Corporation",
    "Sidewalk Damage": "Public Works Department",
    "Drainage Issue": "Sewage and Drainage Department",
  };

  const recipient = recipientMap[issueType] || "Local Municipal Authority";

  const subject = `Urgent: ${issueType} Reported at ${location.address.split(",")[0]} - Requires Immediate Attention`;

  const body = `Dear ${recipient},

I am writing to bring to your immediate attention a civic issue that requires urgent resolution.

ISSUE DETAILS:
Type: ${issueType}
Severity: ${severity.toUpperCase()}
Date Reported: ${date}

LOCATION:
Address: ${location.address}
Coordinates: ${location.latitude}, ${location.longitude}
Google Maps: https://maps.google.com/?q=${location.latitude},${location.longitude}

DESCRIPTION:
${description}

This issue is causing significant inconvenience to residents and poses potential safety risks. I kindly request that your department dispatch a maintenance crew to assess and address this problem at the earliest opportunity.

I have attached a photograph of the affected area for your reference. Please feel free to contact me if you require any additional information regarding this matter.

Thank you for your prompt attention to this matter. I look forward to seeing immediate action within the next 48 hours and will be happy to provide a follow-up once the issue is resolved.

Best regards,
A Concerned Citizen`;

  const fullComplaint = `Subject: ${subject}

${body}`;

  return {
    subject,
    body,
    recipient,
    fullComplaint,
  };
};

// Analyze image using OpenAI Vision API
export async function analyzeImage(imageFile: File): Promise<IssueAnalysis> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
    console.log("No OpenAI API key found, using mock analysis");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockAnalysis();
  }

  try {
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant specialized in analyzing civic issues from images. 
Analyze the image and return a JSON response with the following structure:
{
  "issueType": "One of: Road Damage, Garbage Accumulation, Water Leakage, Street Light Issue, Traffic Signal Problem, Illegal Parking, Graffiti/Vandalism, Sidewalk Damage, Drainage Issue, or Other",
  "confidence": "A number between 0 and 1 representing your confidence in the identification",
  "description": "A detailed description of what you see in the image (2-3 sentences)",
  "severity": "One of: low, medium, high, critical based on urgency and potential impact",
  "suggestedActions": ["Array of 2-3 suggested actions to resolve the issue"]
}`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and identify the civic issue. Provide your response in the specified JSON format.",
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid response from OpenAI");
    }

    const analysis = JSON.parse(content);
    return {
      issueType: analysis.issueType,
      confidence: analysis.confidence || 0.8,
      description: analysis.description,
      severity: analysis.severity || "medium",
      suggestedActions: analysis.suggestedActions || [],
    };
  } catch (error) {
    console.error("Analysis error:", error);
    return mockAnalysis();
  }
}

// Generate complaint using OpenAI API
export async function generateComplaint(
  issueType: string,
  location: LocationData,
  description: string,
  severity: string
): Promise<GeneratedComplaint> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
    console.log("No OpenAI API key found, using mock complaint");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockComplaint(issueType, location, description, severity);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional assistant that helps citizens write formal complaints to local authorities about civic issues.
Generate a well-structured, polite, and professional complaint letter.
Return your response in JSON format with: subject, recipient, body, fullComplaint`,
          },
          {
            role: "user",
            content: `Generate a professional complaint for:
Issue Type: ${issueType}
Location: ${location.address}
Coordinates: ${location.latitude}, ${location.longitude}
Description: ${description}
Severity: ${severity}`,
          },
        ],
        max_tokens: 1500,
        temperature: 0.5,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid response from OpenAI");
    }

    const complaint = JSON.parse(content);
    return {
      subject: complaint.subject,
      recipient: complaint.recipient || "Local Authorities",
      body: complaint.body,
      fullComplaint: complaint.fullComplaint || `${complaint.subject}\n\n${complaint.body}`,
    };
  } catch (error) {
    console.error("Complaint generation error:", error);
    return mockComplaint(issueType, location, description, severity);
  }
}

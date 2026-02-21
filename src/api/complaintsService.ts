import type { GeneratedComplaint } from "../types";

export interface StoredComplaint {
    id: string;
    userId: string;
    subject: string;
    body: string;
    recipient: string;
    status: "pending" | "resolved" | "completed";
    timestamp: string;
}

const STORAGE_KEY = "fixmyarea_complaints";

export const getComplaintsForUser = (userId: string): StoredComplaint[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    let parsedComplaints: StoredComplaint[] = [];
    try {
        parsedComplaints = data ? JSON.parse(data) : [];
    } catch {
        parsedComplaints = [];
    }

    const userComplaints = parsedComplaints.filter((c) => c.userId === userId);

    // Seed some dummy complaints if none exist for this user, so the UI is visible initially
    if (userComplaints.length === 0) {
        const dummy1: StoredComplaint = {
            id: Math.random().toString(36).substring(2, 9),
            userId,
            subject: "Pothole on Main St",
            body: "There is a severe pothole located near the intersection which is causing issues.",
            recipient: "publicworks@city.gov",
            status: "completed",
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        };
        const dummy2: StoredComplaint = {
            id: Math.random().toString(36).substring(2, 9),
            userId,
            subject: "Broken Street Light",
            body: "Street light pole #402 has been out for several nights.",
            recipient: "lightingdept@city.gov",
            status: "pending",
            timestamp: new Date().toISOString(), // Now
        };

        parsedComplaints.push(dummy1, dummy2);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedComplaints));
        userComplaints.push(dummy1, dummy2);
    }

    return userComplaints.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const saveComplaint = (userId: string, complaint: GeneratedComplaint): StoredComplaint => {
    const data = localStorage.getItem(STORAGE_KEY);
    let complaints: StoredComplaint[] = [];
    if (data) {
        try {
            complaints = JSON.parse(data);
        } catch {
            complaints = [];
        }
    }

    // To showcase UI, randomly make older ones resolved, but normally it starts as pending
    const newComplaint: StoredComplaint = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        subject: complaint.subject,
        body: complaint.fullComplaint || complaint.body,
        recipient: complaint.recipient,
        status: "pending",
        timestamp: new Date().toISOString(),
    };

    complaints.push(newComplaint);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    return newComplaint;
};

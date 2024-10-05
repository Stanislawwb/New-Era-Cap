import { v4 as uuidv4 } from 'uuid';
import { FormData } from "../types/detailsFormTypes";

export interface SessionData {
  id?: number;
  sessionId: string;
  formData: FormData;
  codeName?: string | null;
  codeAmount?: number;
}

const SERVER_URL = "http://localhost:3000/sessions";

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

export const createSession = async (sessionData: SessionData): Promise<void> => {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Error creating session: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to create session", error);
  }
};

export const updateSession = async (sessionData: SessionData): Promise<void> => {
  const sessionId = sessionData.sessionId;

  try {
    const existingSession = await getSessionById(sessionId);
    if (!existingSession) {
      throw new Error("Session not found");
    }

    const response = await fetch(`${SERVER_URL}/${existingSession.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error("Failed to update the session");
    }
  } catch (error) {
    console.error("Error updating the session", error);
    throw error;
  }
};


export const getSessionById = async (sessionId: string): Promise<SessionData | null> => {
  try {
    const response = await fetch(`${SERVER_URL}?sessionId=${sessionId}`);
    const sessions = await response.json();

    if (sessions.length > 0) {
      return sessions[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to get session", error);
    return null;
  }
};

export const getSession = async (): Promise<SessionData> => {
  const sessionId = getSessionId();

  if (!sessionId) {
    throw new Error("Session ID is required to fetch the session");
  }

  try {
    const response = await fetch(`${SERVER_URL}?sessionId=${sessionId}`);

    if (!response.ok) {
      throw new Error("Session not found");
    }

    const sessionData = await response.json();
    return sessionData[0] || null;
  } catch (error) {
    console.error("Failed to get session", error);
    throw error;
  }
};

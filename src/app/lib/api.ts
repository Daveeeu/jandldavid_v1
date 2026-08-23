async function requestJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'A kérés sikertelen volt.';

    try {
      const data = (await response.json()) as { message?: string };
      message = data.message ?? message;
    } catch {
      // Keep the fallback message when the server response is not JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as TResponse;
}

export interface AssistantReply {
  content: string;
  type?: 'message' | 'project_summary';
  summaryData?: {
    goal: string;
    audience: string;
    features: string[];
    existingSystem: string;
    technical: string;
    integrations: string;
    deadline: string;
    notes: string;
  };
}

export function sendProjectAssistantMessage(payload: {
  messages: Array<{ role: string; content: string }>;
  project: object;
}) {
  return requestJson<AssistantReply>('/api/ai/project-assistant', payload);
}

export function submitProjectInquiry(payload: object) {
  return requestJson<{ id: number; message: string }>('/api/contact/project', payload);
}

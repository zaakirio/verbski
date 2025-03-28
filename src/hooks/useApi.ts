import { useAuth0 } from '@auth0/auth0-react';

const API_URL = import.meta.env.VITE_API_URL;

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const callApi = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const saveScore = async (score: {
    score: number;
    correct_answers: number;
    total_questions: number;
    personal_pronouns: Record<string, { correct: number; total: number }>;
  }) => {
    return callApi('/scores', {
      method: 'POST',
      body: JSON.stringify(score),
    });
  };

  const getStats = async () => {
    return callApi('/scores');
  };

  return { saveScore, getStats };
} 
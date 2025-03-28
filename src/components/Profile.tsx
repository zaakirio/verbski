import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../hooks/useApi';

interface UserStats {
  total_games: number;
  average_score: number;
  best_score: number;
  personal_pronouns_stats: {
    [key: string]: {
      correct: number;
      total: number;
      percentage: number;
    };
  };
}

export const Profile: React.FC = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const { getStats } = useApi();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      getStats()
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Log in to view profile
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.picture}
            alt={user?.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700">Total Games</h3>
                <p className="text-2xl font-bold text-blue-500">{stats.total_games}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700">Average Score</h3>
                <p className="text-2xl font-bold text-blue-500">{Math.round(stats.average_score)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700">Best Score</h3>
                <p className="text-2xl font-bold text-blue-500">{stats.best_score}%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-4 text-gray-700">Personal Pronoun Performance</h3>
              <div className="space-y-3">
                {Object.entries(stats.personal_pronouns_stats).map(([pronoun, data]) => (
                  <div key={pronoun}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{pronoun}</span>
                      <span className="text-gray-600">{Math.round(data.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
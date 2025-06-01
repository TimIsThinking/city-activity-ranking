import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';

// GraphQL query to fetch activity rankings
import { GET_ACTIVITY_RANKINGS } from '../graphql/queries/cityActivitiyRankings'

export const Welcome = () => {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');

  const [loadRanking, { loading, data, error }] = useLazyQuery(GET_ACTIVITY_RANKINGS);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setSubmittedCity(city);
      loadRanking({
        variables: {
          city,
          activities: ["Skiing", "Surfing", "Outdoor sightseeing", "Indoor sightseeing"]
        }
      })
    }
  };

  let rankings = [];

  if (data && !data.cityActivityRankings.error) {
    let activityRankings = [...data.cityActivityRankings];
    rankings = activityRankings.sort((a: any, b: any) => b.score - a.score); // Sort descending by score
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">City Activity Rankings</h1>
          </div>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter a city (e.g., Oslo)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!city.trim()}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="w-full max-w-md">
          {loading && <p className="text-gray-600 text-center">Loading...</p>}
          {error && <p className="text-red-500 text-center">Error: {error.message}</p>}
          {data?.cityActivityRankings.error && (
            <p className="text-red-500 text-center">{data.cityActivityRankings.error}</p>
          )}
          {rankings.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Rankings for {submittedCity}
              </h2>
              <ul className="space-y-3">
                {rankings.map(({ activity, score }, index) => (
                  <li
                    key={activity}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">
                      {index + 1}. {activity}
                    </span>
                    <span className="text-blue-600 font-medium">
                      {score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
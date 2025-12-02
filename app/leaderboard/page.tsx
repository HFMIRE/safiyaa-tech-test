import Link from "next/link";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/leaderboard`, {
    cache: "no-store",
  });

  const leaderboardData = await response.json();

  return (
    <div className="flex-col mt-10">
      <div className="ml-10">
      <Link href="/"> Back</Link>
      </div>

      <div className="flex flex-col items-center flex-1">

        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-slate-800">
          Leaderboard
        </h1>
      </div>

      <div className="flex flex-col items-center mt-10 gap-4">
        {leaderboardData.length === 0 && (
          <div className="font-medium text-slate-600">
            No scores yet. Play a game first.
          </div>
        )}

        {leaderboardData.length > 0 && (
          <div className="w-full max-w-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2">When</th>
                </tr>
              </thead>

              <tbody>
                {leaderboardData.map((entry: any, index: number) => (
                  <tr
                    key={entry.id}
                    className="border-b last:border-0 text-slate-700"
                  >
                    <td className="py-2 pr-4">{index + 1}</td>
                    <td className="py-2 pr-4">{entry.name}</td>
                    <td className="py-2 pr-4">{entry.score}</td>
                    <td className="py-2 text-sm text-slate-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

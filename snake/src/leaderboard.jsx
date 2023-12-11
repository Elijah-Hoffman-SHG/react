export default function Leaderboard({leaderboard}) {
    return (
        <div>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(leaderboard).map((id, index) => (
                        <tr key={id}>
                            <td>{index + 1}</td>
                            <td>{leaderboard[id].name}</td>
                            <td>{leaderboard[id].score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
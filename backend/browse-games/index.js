const { getFirestoreInstance } = require("./layer/firestoredb");

exports.handler = async (event, context) => {
    console.log(event);
    console.log(event.path);

    const db = await getFirestoreInstance("TRIVIA_TITANS");

    if (event.path === "/games") {
        return browseGames(event, context, db);
    } else if (event.path.startsWith("/game")) {
        return getSpecificGame(event, context, db);
    }
    return {
        statusCode: 404,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: "fail",
            message: "No resources found",
        }),
    };
};

const getSpecificGame = async (event, context, db) => {
    const query = event.queryStringParameters;
    console.log(query);

    const gamesCollectionRef = db.collection("Games");
    const snapshot = await gamesCollectionRef.doc(query?.id).get();

    const game = snapshot.data();
    console.log(game);

    game.teams = await fetchTeamDetails(db, game.teams);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: "success",
            game,
        }),
    };
};

const browseGames = async (event, context, db) => {
    const query = event.queryStringParameters;
    console.log(query);

    const gamesCollectionRef = db.collection("Games");
    const snapshot = await gamesCollectionRef.get();

    const games = [];
    for (const doc of snapshot.docs) {
        games.push({
            ...doc.data(),
            id: doc.id,
        });
    }

    if (!query?.category && !query?.timeframe && !query?.difficulty) {
        let teams = [];
        for (let i = 0; i < games.length; ++i) {
            teams = await fetchTeamDetails(db, games[i].teams);
            games[i].teams = teams;
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Adjust this to allow specific origins
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Content-Type": "application/json", // Add Content-Type header
            },
            body: JSON.stringify({
                status: "success",
                games,
            }),
        };
    }

    const { category, timeframe, difficulty } = query;

    const filteredGames = games.filter((game) => {
        const categoryFilter = category ? game.category.toLowerCase() === category.toLowerCase() : true;
        const difficultyFilter = difficulty ? game.difficulty.toLowerCase() === difficulty.toLowerCase() : true;
        const timeframeFilter = timeframe ? game.timeframe === parseInt(timeframe) : true;
        return categoryFilter && difficultyFilter && timeframeFilter;
    });

    let teams = [];
    for (let i = 0; i < filteredGames.length; ++i) {
        teams = await fetchTeamDetails(db, filteredGames[i].teams);
        filteredGames[i].teams = teams;
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Adjust this to allow specific origins
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Content-Type": "application/json", // Add Content-Type header
        },
        body: JSON.stringify({
            status: "success",
            games: filteredGames,
        }),
    };
};

const fetchTeamDetails = async (db, teamsId) => {
    const teams = [];
    for (const team of teamsId) {
        console.log(team);
        const teamsCollectionRef = await db.collection("Teams");
        const snapshot = await teamsCollectionRef.doc(team).get();

        const teamsData = snapshot.data();
        console.log("SNAPSHOT DATA ==" + teamsData.name);

        teams.push({
            ...snapshot.data(),
            teamId: snapshot.id,
        });

        const users = [];
        for (const userId of teamsData.users) {
            console.log(userId);
            const usersCollectionRef = await db.collection("Users");
            const userSnapshot = await usersCollectionRef.doc(userId).get();

            users.push({
                ...userSnapshot.data(),
                userId: userSnapshot.id,
            });
        }

        teams.forEach(({ teamId }, i) => {
            if (teamId === team) {
                teams[i].users = [...users];
            }
        });
    }
    return teams;
};

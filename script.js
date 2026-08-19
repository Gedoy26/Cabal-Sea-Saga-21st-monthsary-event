/* =========================================================
   CABAL SEA SAGA
   REFERRAL EVENT 2026
   GOOGLE SHEETS + LEADERBOARD
   ========================================================= */


/* =========================================================
   GOOGLE SHEETS
   ========================================================= */

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGD4YlzmRUcGYxjnxPx6ulbrYUoCMBBamAHrEJoalGgYDqmRhQgrxIDKWsv-K1J-uJZ9wwYbcxmPGe/pub?gid=1450898287&single=true&output=csv";


/* =========================================================
   REWARDS
   ========================================================= */

/*
   Add or change rewards here.

   Example:

   1: "10,000 Force Gems"
   2: "7,500 Force Gems"

   You can keep adding:

   6: "Reward"
   7: "Reward"
   8: "Reward"

   Players beyond the last listed reward
   will show "No Reward".
*/

const rewards = {

    1: "10,000 Force Gems",

    2: "7,500 Force Gems",

    3: "5,000 Force Gems",

    4: "3,000 Force Gems",

    5: "2,000 Force Gems"

};


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   LOAD GOOGLE SHEET
   ========================================================= */

async function loadStandings() {

    const table =
        document.getElementById(
            "standings"
        );


    try {

        const response =
            await fetch(
                SHEET_URL
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load Google Sheet."
            );

        }


        const csv =
            await response.text();


        const players =
            parseCSV(
                csv
            );


        displayStandings(
            players
        );


        updatePodium(
            players
        );


        updateLastUpdated();


    } catch (error) {

        console.error(
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading"
                >

                    Unable to load standings.

                </td>

            </tr>

        `;

    }

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(csv) {

    const lines =
        csv
            .trim()
            .split(/\r?\n/);


    const players = [];


    /*
       Expected columns:

       Column A = IGN
       Column B = Referral
       Column C = Rank
    */


    for (
        let i = 1;
        i < lines.length;
        i++
    ) {

        const columns =
            parseCSVLine(
                lines[i]
            );


        if (
            !columns ||
            columns.length < 2
        ) {

            continue;

        }


        const ign =
            columns[0]
                ?.trim();


        const referrals =
            parseInt(
                columns[1]
                    ?.trim()
            ) || 0;


        if (!ign) {

            continue;

        }


        players.push({

            ign: ign,

            referrals: referrals

        });

    }


    /*
       Sort highest referral count first.
    */

    players.sort(
        function(a, b) {

            return (
                b.referrals -
                a.referrals
            );

        }
    );


    return players;

}


/* =========================================================
   CSV LINE PARSER
   ========================================================= */

function parseCSVLine(line) {

    const result = [];

    let current = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < line.length;
        i++
    ) {

        const char =
            line[i];


        if (
            char === '"'
        ) {

            insideQuotes =
                !insideQuotes;

        }

        else if (
            char === "," &&
            !insideQuotes
        ) {

            result.push(
                current
            );

            current = "";

        }

        else {

            current += char;

        }

    }


    result.push(
        current
    );


    return result;

}


/* =========================================================
   DISPLAY STANDINGS
   ========================================================= */

function displayStandings(
    players
) {

    const table =
        document.getElementById(
            "standings"
        );


    if (
        !players.length
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading"
                >

                    No players found.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        players

            .map(

                function(
                    player,
                    index
                ) {


                    /*
                       Ranking is based on
                       referral count.
                    */

                    const rank =
                        index + 1;


                    /*
                       Get reward based
                       on ranking.
                    */

                    const reward =
                        rewards[rank] ||
                        "No Reward";


                    return `

                        <tr>

                            <td
                                class="rank"
                            >

                                #${rank}

                            </td>


                            <td>

                                <strong>

                                    ${escapeHTML(
                                        player.ign
                                    )}

                                </strong>

                            </td>


                            <td
                                class="referrals"
                            >

                                ${player.referrals}

                            </td>


                            <td
                                class="reward"
                            >

                                ${escapeHTML(
                                    reward
                                )}

                            </td>

                        </tr>

                    `;

                }

            )

            .join("");

}


/* =========================================================
   TOP 3 PODIUM
   ========================================================= */

function updatePodium(
    players
) {

    const podium =
        document.getElementById(
            "podium"
        );


    if (
        !podium ||
        !players.length
    ) {

        return;

    }


    const topPlayers =
        players.slice(
            0,
            3
        );


    const medals = [

        "🥇",

        "🥈",

        "🥉"

    ];


    podium.innerHTML =

        topPlayers

            .map(

                function(
                    player,
                    index
                ) {


                    const rank =
                        index + 1;


                    return `

                        <div
                            class="podium-card
                            ${
                                rank === 1
                                    ? "first"
                                    : ""
                            }"
                        >

                            <div>

                                <div
                                    class="medal"
                                >

                                    ${medals[index]}

                                </div>


                                <div
                                    class="podium-place"
                                >

                                    ${rank === 1
                                        ? "1ST PLACE"
                                        : rank === 2
                                        ? "2ND PLACE"
                                        : "3RD PLACE"
                                    }

                                </div>


                                <div
                                    class="podium-ign"
                                >

                                    ${escapeHTML(
                                        player.ign
                                    )}

                                </div>


                                <div
                                    class="podium-count"
                                >

                                    ${
                                        player.referrals
                                    }
                                    Referrals

                                </div>

                            </div>

                        </div>

                    `;

                }

            )

            .join("");

}


/* =========================================================
   LAST UPDATED
   ========================================================= */

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) {

        return;

    }


    const now =
        new Date();


    element.textContent =
        "Last updated: " +
        now.toLocaleString();

}


/* =========================================================
   COUNTDOWN
   ========================================================= */

/*
   Event deadline:
   September 7, 2026

   Change the time here if needed.
*/

const eventEnd =
    new Date(
        "September 7, 2026 23:59:59"
    ).getTime();


function updateCountdown() {

    const element =
        document.getElementById(
            "countdown"
        );


    if (!element) {

        return;

    }


    const now =
        new Date().getTime();


    const distance =
        eventEnd - now;


    if (
        distance <= 0
    ) {

        element.textContent =
            "EVENT ENDED";

        return;

    }


    const days =
        Math.floor(
            distance /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                distance %
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) /
            (
                1000 *
                60 *
                60
            )
        );


    const minutes =
        Math.floor(
            (
                distance %
                (
                    1000 *
                    60 *
                    60
                )
            ) /
            (
                1000 *
                60
            )
        );


    const seconds =
        Math.floor(
            (
                distance %
                (
                    1000 *
                    60
                )
            ) /
            1000
        );


    element.textContent =

        `${days}D ` +

        `${String(hours).padStart(2, "0")}H ` +

        `${String(minutes).padStart(2, "0")}M ` +

        `${String(seconds).padStart(2, "0")}S`;

}


/* =========================================================
   START
   ========================================================= */

loadStandings();


/*
   Refresh standings every 60 seconds.
*/

setInterval(
    loadStandings,
    60000
);


/*
   Update countdown every second.
*/

setInterval(
    updateCountdown,
    1000
);


updateCountdown();

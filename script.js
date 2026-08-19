/* =========================================================
   CABAL SEA SAGA
   REFERRAL EVENT 2026

   GOOGLE SHEETS LEADERBOARD
   ========================================================= */


/* =========================================================
   GOOGLE SHEET SETTINGS
   ========================================================= */

// Your Google Spreadsheet ID
const SHEET_ID =
    "1EHqhhNsBeJxLXSaGi-whVUbwFdRey8_Ybhx2XgSGVxs";

// The exact name of the tab
const SHEET_NAME =
    "Referral Counter";


/*
   Google Sheets Visualization API URL.

   The website uses this to read the published
   Referral Counter tab.
*/

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/" +
    SHEET_ID +
    "/gviz/tq?sheet=" +
    encodeURIComponent(SHEET_NAME);


/* =========================================================
   EVENT SETTINGS
   ========================================================= */

// September 7, 2026 at 11:59:59 PM Philippine Time
const EVENT_DEADLINE =
    "2026-09-07T23:59:59+08:00";


/* =========================================================
   LOAD DATA FROM GOOGLE SHEETS
   ========================================================= */

async function loadStandings() {

    const table =
        document.getElementById("standings");

    const podium =
        document.getElementById("podium");


    /*
       Show loading message while the sheet
       is being retrieved.
    */

    table.innerHTML = `
        <tr>
            <td colspan="4" class="loading">
                Loading current standings...
            </td>
        </tr>
    `;


    try {

        /*
           Request the Google Sheet.
        */

        const response =
            await fetch(SHEET_URL);


        /*
           Check if Google responded successfully.
        */

        if (!response.ok) {

            throw new Error(
                "Unable to access Google Sheet."
            );

        }


        /*
           Get the response as text.
        */

        const text =
            await response.text();


        /*
           Google returns something similar to:

           google.visualization.Query.setResponse({...});

           We extract only the JSON portion.
        */

        const start =
            text.indexOf("{");

        const end =
            text.lastIndexOf("}");


        if (
            start === -1 ||
            end === -1
        ) {

            throw new Error(
                "Invalid Google Sheet response."
            );

        }


        const jsonText =
            text.substring(
                start,
                end + 1
            );


        /*
           Convert the response to JSON.
        */

        const data =
            JSON.parse(jsonText);


        /*
           Store players here.
        */

        const players = [];


        /*
           Read every row from the sheet.
        */

        data.table.rows.forEach(
            function(row) {

                const cells =
                    row.c || [];


                /*
                   COLUMN A
                   IGN
                */

                const ign =
                    cells[0]?.v;


                /*
                   COLUMN B
                   REFERRAL COUNT
                */

                const referralValue =
                    cells[1]?.v;


                /*
                   COLUMN C
                   RANK
                */

                const rankValue =
                    cells[2]?.v;


                /*
                   Convert referral count
                   into a number.
                */

                const referrals =
                    Number(
                        referralValue || 0
                    );


                /*
                   Convert rank into a number.
                */

                const rank =
                    Number(
                        rankValue || 0
                    );


                /*
                   Ignore empty rows.

                   This also prevents the header
                   row from being displayed as a player.
                */

                if (
                    ign !== undefined &&
                    ign !== null &&
                    String(ign).trim() !== "" &&
                    String(ign).toUpperCase() !== "IGN"
                ) {

                    players.push({

                        ign:
                            String(ign).trim(),

                        referrals:
                            referrals,

                        rank:
                            rank,

                        reward:
                            "TBA"

                    });

                }

            }
        );


        /*
           Sort players by referral count.

           Highest referral count = highest rank.
        */

        players.sort(
            function(a, b) {

                return (
                    b.referrals -
                    a.referrals
                );

            }
        );


        /*
           Display the top 3.
        */

        renderPodium(players);


        /*
           Display the complete leaderboard.
        */

        renderLeaderboard(players);


        /*
           Update the timestamp.
        */

        const updated =
            document.getElementById(
                "lastUpdated"
            );


        if (updated) {

            const now =
                new Date();


            updated.textContent =
                now.toLocaleTimeString(
                    "en-PH",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }


        console.log(
            "Leaderboard loaded successfully.",
            players
        );


    } catch (error) {

        /*
           Show the error in the browser console.
        */

        console.error(
            "Google Sheet Error:",
            error
        );


        /*
           Clear podium.
        */

        podium.innerHTML = "";


        /*
           Display an error message.
        */

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading"
                >

                    Unable to load the current
                    standings.

                    <br><br>

                    Please make sure the
                    <strong>
                        Referral Counter
                    </strong>
                    tab is published to the web.

                </td>

            </tr>

        `;

    }

}


/* =========================================================
   TOP 3 PODIUM
   ========================================================= */

function renderPodium(players) {

    const podium =
        document.getElementById(
            "podium"
        );


    /*
       If there are no players,
       don't show a podium.
    */

    if (
        !players ||
        players.length === 0
    ) {

        podium.innerHTML = "";

        return;

    }


    /*
       Medal icons.
    */

    const medals = [

        "🥇",
        "🥈",
        "🥉"

    ];


    /*
       Place names.
    */

    const places = [

        "1ST PLACE",
        "2ND PLACE",
        "3RD PLACE"

    ];


    /*
       Only take the first three players.
    */

    const topThree =
        players.slice(0, 3);


    /*
       Create the podium.
    */

    podium.innerHTML =

        topThree
            .map(
                function(player, index) {

                    return `

                        <div
                            class="
                                podium-card
                                ${
                                    index === 0
                                        ? "first"
                                        : ""
                                }
                            "
                        >

                            <div class="medal">
                                ${medals[index]}
                            </div>


                            <div>

                                <div
                                    class="podium-place"
                                >
                                    ${places[index]}
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

                                    ${player.referrals}

                                    valid referral${
                                        player.referrals === 1
                                            ? ""
                                            : "s"
                                    }

                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   FULL LEADERBOARD
   ========================================================= */

function renderLeaderboard(players) {

    const table =
        document.getElementById(
            "standings"
        );


    /*
       No players.
    */

    if (
        !players ||
        players.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading"
                >

                    No participants yet.

                </td>

            </tr>

        `;

        return;

    }


    /*
       Create table rows.
    */

    table.innerHTML =

        players
            .map(
                function(player, index) {

                    /*
                       Website rank.

                       Because the players are sorted
                       by referral count, this will
                       always show the current order.
                    */

                    const currentRank =
                        index + 1;


                    return `

                        <tr>

                            <td class="rank">
                                #${currentRank}
                            </td>


                            <td>

                                <strong>
                                    ${escapeHTML(
                                        player.ign
                                    )}
                                </strong>

                            </td>


                            <td class="referrals">
                                ${player.referrals}
                            </td>


                            <td class="reward">
                                ${escapeHTML(
                                    player.reward
                                )}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   COUNTDOWN
   ========================================================= */

function updateCountdown() {

    const countdown =
        document.getElementById(
            "countdown"
        );


    /*
       Get event deadline.
    */

    const deadline =
        new Date(
            EVENT_DEADLINE
        ).getTime();


    /*
       Get current time.
    */

    const now =
        Date.now();


    /*
       Calculate remaining time.
    */

    const difference =
        deadline - now;


    /*
       Event is over.
    */

    if (
        difference <= 0
    ) {

        countdown.textContent =
            "EVENT CLOSED";

        return;

    }


    /*
       Calculate days.
    */

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    /*
       Calculate hours.
    */

    const hours =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    /*
       Calculate minutes.
    */

    const minutes =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    /*
       Calculate seconds.
    */

    const seconds =
        Math.floor(
            (
                difference %
                (1000 * 60)
            ) /
            1000
        );


    /*
       Display countdown.

       Example:

       19D 04:32:18
    */

    countdown.textContent =

        `${days}D ` +

        `${String(hours).padStart(2, "0")}:` +

        `${String(minutes).padStart(2, "0")}:` +

        `${String(seconds).padStart(2, "0")}`;

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /[&<>"']/g,

            function(character) {

                const replacements = {

                    "&":
                        "&amp;",

                    "<":
                        "&lt;",

                    ">":
                        "&gt;",

                    '"':
                        "&quot;",

                    "'":
                        "&#039;"

                };


                return replacements[
                    character
                ];

            }
        );

}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */


/*
   Start countdown.
*/

updateCountdown();


/*
   Update countdown every second.
*/

setInterval(
    updateCountdown,
    1000
);


/*
   Load Google Sheet immediately
   when the page opens.
*/

loadStandings();


/*
   Refresh Google Sheet every 5 minutes.

   You can change 5 to another number
   if you want more/less frequent updates.

   Example:
   1 * 60 * 1000 = 1 minute
   5 * 60 * 1000 = 5 minutes
   10 * 60 * 1000 = 10 minutes
*/

setInterval(
    loadStandings,
    5 * 60 * 1000
);

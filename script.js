/* =========================================================
   CABAL SEA SAGA
   REFERRAL EVENT
   LIVE GOOGLE SHEETS LEADERBOARD
   ========================================================= */


/* =========================================================
   GOOGLE SHEETS SETTINGS
   ========================================================= */

const SHEET_ID =
    "1EHqhhNsBeJxLXSaGi-whVUbwFdRey8_Ybhx2XgSGVxs";

const SHEET_GID =
    "1450898287";


/*
 * Google Visualization API.
 *
 * This specifically requests the
 * Referral Counter tab.
 */

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/" +
    SHEET_ID +
    "/gviz/tq" +
    "?gid=" +
    SHEET_GID +
    "&tqx=out:json";


/* =========================================================
   EVENT SETTINGS
   ========================================================= */

const EVENT_DEADLINE =
    "2026-09-07T23:59:59+08:00";


/* =========================================================
   LOAD GOOGLE SHEET
   ========================================================= */

async function loadStandings() {

    console.log(
        "Loading Google Sheet..."
    );


    const table =
        document.getElementById(
            "standings"
        );


    const podium =
        document.getElementById(
            "podium"
        );


    /*
     * Loading message
     */

    if (table) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="loading"
                >

                    Loading current standings...

                </td>

            </tr>

        `;

    }


    try {

        /*
         * Prevent browser caching.
         */

        const url =
            SHEET_URL +
            "&_=" +
            Date.now();


        /*
         * Request Google Sheet.
         */

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Google Sheet request failed: " +
                response.status
            );

        }


        /*
         * Get response text.
         */

        let text =
            await response.text();


        console.log(
            "Google response:",
            text
        );


        /*
         * Google returns:

         google.visualization.Query.setResponse({...});

         We need to extract the JSON
         between the parentheses.
        */

        const start =
            text.indexOf("(");


        const end =
            text.lastIndexOf(")");


        if (
            start === -1 ||
            end === -1
        ) {

            throw new Error(
                "Invalid Google response."
            );

        }


        const jsonText =
            text.substring(
                start + 1,
                end
            );


        /*
         * Convert to JavaScript object.
         */

        const data =
            JSON.parse(
                jsonText
            );


        console.log(
            "Google Sheet data:",
            data
        );


        /*
         * Google Sheet rows.
         */

        const rows =
            data.table.rows;


        const players = [];


        /*
         * Read each row.
         */

        rows.forEach(
            function(row) {

                const cells =
                    row.c || [];


                /*
                 * COLUMN A
                 *
                 * IGN
                 */

                let ign = "";


                if (
                    cells[0] &&
                    cells[0].v !== null &&
                    cells[0].v !== undefined
                ) {

                    ign =
                        String(
                            cells[0].v
                        ).trim();

                }


                /*
                 * Ignore blank rows.
                 */

                if (
                    ign === ""
                ) {

                    return;

                }


                /*
                 * Ignore header row.
                 */

                if (
                    ign.toUpperCase() ===
                    "IGN"
                ) {

                    return;

                }


                /*
                 * COLUMN B
                 *
                 * REFERRAL COUNT
                 */

                let referrals = 0;


                if (
                    cells[1] &&
                    cells[1].v !== null &&
                    cells[1].v !== undefined
                ) {

                    referrals =
                        Number(
                            cells[1].v
                        ) || 0;

                }


                /*
                 * COLUMN C
                 *
                 * RANK
                 */

                let rank = 0;


                if (
                    cells[2] &&
                    cells[2].v !== null &&
                    cells[2].v !== undefined
                ) {

                    rank =
                        Number(
                            cells[2].v
                        ) || 0;

                }


                /*
                 * Add player.
                 */

                players.push({

                    ign:
                        ign,

                    referrals:
                        referrals,

                    rank:
                        rank

                });

            }
        );


        /*
         * Sort using referral count.
         *
         * Highest referral count first.
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
         * Display results.
         */

        renderPodium(
            players
        );


        renderLeaderboard(
            players
        );


        /*
         * Update timestamp.
         */

        const lastUpdated =
            document.getElementById(
                "lastUpdated"
            );


        if (
            lastUpdated
        ) {

            lastUpdated.textContent =
                "Updated " +
                new Date().toLocaleTimeString(
                    "en-PH",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                );

        }


        console.log(
            "FINAL PLAYERS:",
            players
        );


    } catch (error) {

        console.error(
            "ERROR LOADING GOOGLE SHEET:",
            error
        );


        if (podium) {

            podium.innerHTML = "";

        }


        if (table) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="loading"
                    >

                        Unable to load
                        standings.

                        <br><br>

                        Please check the
                        Google Sheet connection.

                    </td>

                </tr>

            `;

        }

    }

}


/* =========================================================
   PODIUM
   ========================================================= */

function renderPodium(
    players
) {

    const podium =
        document.getElementById(
            "podium"
        );


    if (
        !podium
    ) {

        return;

    }


    if (
        players.length === 0
    ) {

        podium.innerHTML =
            "";

        return;

    }


    const medals = [

        "🥇",
        "🥈",
        "🥉"

    ];


    const places = [

        "1ST PLACE",
        "2ND PLACE",
        "3RD PLACE"

    ];


    const topPlayers =
        players.slice(
            0,
            3
        );


    podium.innerHTML =

        topPlayers
            .map(
                function(
                    player,
                    index
                ) {

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

                            <div
                                class="medal"
                            >

                                ${medals[index]}

                            </div>


                            <div>

                                <div
                                    class="
                                        podium-place
                                    "
                                >

                                    ${places[index]}

                                </div>


                                <div
                                    class="
                                        podium-ign
                                    "
                                >

                                    ${escapeHTML(
                                        player.ign
                                    )}

                                </div>


                                <div
                                    class="
                                        podium-count
                                    "
                                >

                                    ${
                                        player.referrals
                                    }

                                    ${
                                        player.referrals === 1
                                            ? " referral"
                                            : " referrals"
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
   LEADERBOARD
   ========================================================= */

function renderLeaderboard(
    players
) {

    const table =
        document.getElementById(
            "standings"
        );


    if (
        !table
    ) {

        return;

    }


    if (
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


    table.innerHTML =

        players
            .map(
                function(
                    player,
                    index
                ) {

                    const rank =
                        index + 1;


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
                                class="
                                    referrals
                                "
                            >

                                ${player.referrals}

                            </td>


                            <td
                                class="reward"
                            >

                                TBA

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


    if (
        !countdown
    ) {

        return;

    }


    const deadline =
        new Date(
            EVENT_DEADLINE
        ).getTime();


    const now =
        Date.now();


    const difference =
        deadline -
        now;


    if (
        difference <= 0
    ) {

        countdown.textContent =
            "EVENT CLOSED";

        return;

    }


    const days =
        Math.floor(
            difference /
            86400000
        );


    const hours =
        Math.floor(
            (
                difference %
                86400000
            ) /
            3600000
        );


    const minutes =
        Math.floor(
            (
                difference %
                3600000
            ) /
            60000
        );


    const seconds =
        Math.floor(
            (
                difference %
                60000
            ) /
            1000
        );


    countdown.textContent =

        `${days}D ` +

        `${String(hours).padStart(
            2,
            "0"
        )}:` +

        `${String(minutes).padStart(
            2,
            "0"
        )}:` +

        `${String(seconds).padStart(
            2,
            "0"
        )}`;

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value
    )

        .replace(
            /[&<>"']/g,

            function(
                character
            ) {

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
   START WEBSITE
   ========================================================= */


/*
 * Start countdown.
 */

updateCountdown();


/*
 * Update countdown every second.
 */

setInterval(
    updateCountdown,
    1000
);


/*
 * Load Google Sheet.
 */

loadStandings();


/*
 * Refresh standings every 5 minutes.
 */

setInterval(
    loadStandings,
    5 * 60 * 1000
);

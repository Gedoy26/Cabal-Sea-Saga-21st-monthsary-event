/* =========================================================
   CABAL SEA SAGA
   REFERRAL EVENT 2026
   LIVE GOOGLE SHEETS LEADERBOARD
   ========================================================= */


/* =========================================================
   GOOGLE SHEETS CONNECTION
   ========================================================= */

// Published Google Sheet
// Tab: Referral Counter
// A = IGN
// B = Referral Count
// C = Rank

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGD4YlzmRUcGYxjnxPx6ulbrYUoCMBBamAHrEJoalGgYDqmRhQgrxIDKWsv-K1J-uJZ9wwYbcxmPGe/pub?output=csv&gid=1450898287";


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
     * Show loading message
     */

    if (table) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="loading">
                    Loading current standings...
                </td>
            </tr>
        `;

    }


    try {

        /*
         * Add timestamp to prevent the browser
         * from showing an old cached version.
         */

        const url =
            SHEET_URL +
            "&cache=" +
            Date.now();


        /*
         * Request the published Google Sheet.
         */

        const response =
            await fetch(url);


        /*
         * Make sure the request succeeded.
         */

        if (!response.ok) {

            throw new Error(
                "Google Sheet could not be accessed."
            );

        }


        /*
         * Get CSV data.
         */

        const csv =
            await response.text();


        console.log(
            "Google Sheet CSV:",
            csv
        );


        /*
         * Convert CSV into rows.
         */

        const rows =
            parseCSV(csv);


        console.log(
            "Parsed Google Sheet rows:",
            rows
        );


        /*
         * Store player information.
         */

        const players = [];


        /*
         * Row 0 is the header.
         *
         * Example:
         *
         * IGN | REFERRAL | RANK
         *
         * Start at row 1.
         */

        for (
            let i = 1;
            i < rows.length;
            i++
        ) {

            const row =
                rows[i];


            /*
             * Skip empty rows.
             */

            if (
                !row ||
                row.length === 0
            ) {

                continue;

            }


            /*
             * COLUMN A
             *
             * IGN
             */

            const ign =
                String(
                    row[0] || ""
                ).trim();


            /*
             * COLUMN B
             *
             * REFERRAL COUNT
             */

            const referralText =
                String(
                    row[1] || "0"
                );


            /*
             * Remove anything that isn't
             * a number.
             *
             * Example:
             *
             * "15"
             * "15 referrals"
             *
             * both become 15.
             */

            const referrals =
                parseInt(
                    referralText.replace(
                        /[^0-9-]/g,
                        ""
                    ),
                    10
                ) || 0;


            /*
             * COLUMN C
             *
             * RANK
             */

            const rankText =
                String(
                    row[2] || ""
                );


            const rank =
                parseInt(
                    rankText.replace(
                        /[^0-9-]/g,
                        ""
                    ),
                    10
                ) || 0;


            /*
             * Ignore blank IGN rows.
             */

            if (
                ign === ""
            ) {

                continue;

            }


            /*
             * Ignore the header if Google
             * happens to include it.
             */

            if (
                ign.toUpperCase() === "IGN"
            ) {

                continue;

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
                    rank,

                reward:
                    "TBA"

            });

        }


        /*
         * Sort by referral count.
         *
         * Highest referral count goes first.
         */

        players.sort(
            function(a, b) {

                return (
                    b.referrals -
                    a.referrals
                );

            }
        );


        console.log(
            "Final players:",
            players
        );


        /*
         * Display podium.
         */

        renderPodium(players);


        /*
         * Display leaderboard.
         */

        renderLeaderboard(players);


        /*
         * Update last updated time.
         */

        const lastUpdated =
            document.getElementById(
                "lastUpdated"
            );


        if (lastUpdated) {

            lastUpdated.textContent =
                "Updated " +
                new Date().toLocaleTimeString(
                    "en-PH",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );

        }


    } catch (error) {

        console.error(
            "Google Sheet error:",
            error
        );


        /*
         * Clear podium.
         */

        if (podium) {

            podium.innerHTML = "";

        }


        /*
         * Show error message.
         */

        if (table) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="loading"
                    >

                        Unable to load the
                        current standings.

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

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(text) {

    const rows = [];

    let currentRow = [];

    let currentValue = "";

    let insideQuotes = false;


    /*
     * Go through every character.
     */

    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const character =
            text[i];


        const nextCharacter =
            text[i + 1];


        /*
         * Double quote inside quoted text.
         */

        if (
            character === '"' &&
            insideQuotes &&
            nextCharacter === '"'
        ) {

            currentValue += '"';

            i++;

            continue;

        }


        /*
         * Start/end quoted field.
         */

        if (
            character === '"'
        ) {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        /*
         * Comma = next column.
         */

        if (
            character === "," &&
            !insideQuotes
        ) {

            currentRow.push(
                currentValue
            );

            currentValue = "";

            continue;

        }


        /*
         * New line = next row.
         */

        if (
            (
                character === "\n" ||
                character === "\r"
            ) &&
            !insideQuotes
        ) {

            /*
             * Handle Windows CRLF.
             */

            if (
                character === "\r" &&
                nextCharacter === "\n"
            ) {

                i++;

            }


            currentRow.push(
                currentValue
            );

            currentValue = "";


            /*
             * Add row only if it has data.
             */

            if (
                currentRow.length > 0
            ) {

                rows.push(
                    currentRow
                );

            }


            currentRow = [];

            continue;

        }


        /*
         * Normal character.
         */

        currentValue +=
            character;

    }


    /*
     * Add the final row.
     */

    if (
        currentValue !== "" ||
        currentRow.length > 0
    ) {

        currentRow.push(
            currentValue
        );

        rows.push(
            currentRow
        );

    }


    return rows;

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
     * If the website doesn't have
     * a podium element, stop here.
     */

    if (!podium) {

        return;

    }


    /*
     * No players.
     */

    if (
        players.length === 0
    ) {

        podium.innerHTML = "";

        return;

    }


    /*
     * Medals.
     */

    const medals = [

        "🥇",
        "🥈",
        "🥉"

    ];


    /*
     * Positions.
     */

    const places = [

        "1ST PLACE",
        "2ND PLACE",
        "3RD PLACE"

    ];


    /*
     * Only display top 3.
     */

    const topThree =
        players.slice(
            0,
            3
        );


    /*
     * Generate podium HTML.
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

                            <div
                                class="medal"
                            >
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
   FULL LEADERBOARD
   ========================================================= */

function renderLeaderboard(players) {

    const table =
        document.getElementById(
            "standings"
        );


    /*
     * If table doesn't exist,
     * stop here.
     */

    if (!table) {

        return;

    }


    /*
     * No players.
     */

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


    /*
     * Generate all rows.
     */

    table.innerHTML =

        players
            .map(
                function(player, index) {

                    /*
                     * Rank is based on
                     * current sorted position.
                     */

                    const currentRank =
                        index + 1;


                    return `

                        <tr>

                            <td
                                class="rank"
                            >
                                #${currentRank}
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
     * If the countdown element
     * doesn't exist, stop.
     */

    if (!countdown) {

        return;

    }


    /*
     * Calculate remaining time.
     */

    const deadline =
        new Date(
            EVENT_DEADLINE
        ).getTime();


    const currentTime =
        Date.now();


    const difference =
        deadline -
        currentTime;


    /*
     * Event ended.
     */

    if (
        difference <= 0
    ) {

        countdown.textContent =
            "EVENT CLOSED";

        return;

    }


    /*
     * Days.
     */

    const days =
        Math.floor(
            difference /
            86400000
        );


    /*
     * Hours.
     */

    const hours =
        Math.floor(
            (
                difference %
                86400000
            ) /
            3600000
        );


    /*
     * Minutes.
     */

    const minutes =
        Math.floor(
            (
                difference %
                3600000
            ) /
            60000
        );


    /*
     * Seconds.
     */

    const seconds =
        Math.floor(
            (
                difference %
                60000
            ) /
            1000
        );


    /*
     * Display countdown.
     */

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
   SECURITY
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
   INITIALIZE
   ========================================================= */


/*
 * Start countdown immediately.
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
 * Load the Google Sheet immediately.
 */

loadStandings();


/*
 * Refresh leaderboard every 5 minutes.
 *
 * Google Sheets itself may take a few minutes
 * to update its published version.
 */

setInterval(
    loadStandings,
    5 * 60 * 1000
);

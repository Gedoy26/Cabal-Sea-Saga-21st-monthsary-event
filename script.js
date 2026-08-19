/* =========================================================
   CABAL SEA SAGA
   REFERRAL EVENT 2026

   SAMPLE LEADERBOARD DATA

   IMPORTANT:
   This is currently using sample data.

   Later, we can connect this to your Google Sheets
   "IGN REFERRAL RANK" tab so the website updates
   automatically.
   ========================================================= */


/* ---------------------------------------------------------
   EVENT SETTINGS
--------------------------------------------------------- */

const eventData = {

    /*
     * Event deadline
     *
     * Philippine Time (UTC+8)
     */
    deadline:
        "2026-09-07T23:59:59+08:00",


    /*
     * Change this whenever you update the tracker.
     */
    lastUpdated:
        "August 19, 2026",


    /*
     * SAMPLE DATA
     *
     * Replace these with your actual players.
     */
    standings: [

        {
            ign: "PLAYERONE",
            referrals: 25,
            reward: "TBA"
        },

        {
            ign: "PLAYERTWO",
            referrals: 21,
            reward: "TBA"
        },

        {
            ign: "PLAYERTHREE",
            referrals: 18,
            reward: "TBA"
        },

        {
            ign: "PLAYERFOUR",
            referrals: 15,
            reward: "TBA"
        },

        {
            ign: "PLAYERFIVE",
            referrals: 12,
            reward: "TBA"
        },

        {
            ign: "PLAYERSIX",
            referrals: 10,
            reward: "TBA"
        },

        {
            ign: "PLAYERSEVEN",
            referrals: 9,
            reward: "TBA"
        },

        {
            ign: "PLAYER EIGHT",
            referrals: 7,
            reward: "TBA"
        },

        {
            ign: "PLAYER NINE",
            referrals: 5,
            reward: "TBA"
        },

        {
            ign: "PLAYER TEN",
            referrals: 3,
            reward: "TBA"
        }

    ]

};


/* ---------------------------------------------------------
   SORT STANDINGS
--------------------------------------------------------- */

const sortedStandings =
    [...eventData.standings]
        .sort(
            (a, b) =>
                b.referrals - a.referrals
        );


/* ---------------------------------------------------------
   RENDER TOP 3
--------------------------------------------------------- */

function renderPodium() {

    const podium =
        document.getElementById("podium");


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


    const topThree =
        sortedStandings.slice(0, 3);


    podium.innerHTML =
        topThree
            .map((player, index) => {

                return `

                    <div class="podium-card
                        ${index === 0 ? "first" : ""}">

                        <div class="medal">
                            ${medals[index]}
                        </div>

                        <div>

                            <div class="podium-place">
                                ${places[index]}
                            </div>

                            <div class="podium-ign">
                                ${escapeHTML(
                                    player.ign
                                )}
                            </div>

                            <div class="podium-count">

                                ${
                                    player.referrals
                                }

                                valid referral
                                ${
                                    player.referrals === 1
                                        ? ""
                                        : "s"
                                }

                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ---------------------------------------------------------
   RENDER FULL LEADERBOARD
--------------------------------------------------------- */

function renderLeaderboard() {

    const table =
        document.getElementById(
            "standings"
        );


    table.innerHTML =
        sortedStandings
            .map((player, index) => {

                return `

                    <tr>

                        <td class="rank">
                            #${index + 1}
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

            })
            .join("");

}


/* ---------------------------------------------------------
   COUNTDOWN
--------------------------------------------------------- */

function updateCountdown() {

    const countdown =
        document.getElementById(
            "countdown"
        );


    const deadline =
        new Date(
            eventData.deadline
        ).getTime();


    const now =
        Date.now();


    const difference =
        deadline - now;


    /*
     * Event has ended
     */
    if (difference <= 0) {

        countdown.textContent =
            "EVENT CLOSED";

        return;

    }


    /*
     * Time calculations
     */

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                difference %
                (1000 * 60)
            ) /
            1000
        );


    countdown.textContent =

        `${days}D ` +

        `${String(hours).padStart(2, "0")}:` +

        `${String(minutes).padStart(2, "0")}:` +

        `${String(seconds).padStart(2, "0")}`;

}


/* ---------------------------------------------------------
   HTML SAFETY
--------------------------------------------------------- */

function escapeHTML(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            function(character) {

                const replacements = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                };


                return replacements[
                    character
                ];

            }
        );

}


/* ---------------------------------------------------------
   LAST UPDATED
--------------------------------------------------------- */

document.getElementById(
    "lastUpdated"
).textContent =
    eventData.lastUpdated;


/* ---------------------------------------------------------
   INITIALIZE WEBSITE
--------------------------------------------------------- */

renderPodium();

renderLeaderboard();

updateCountdown();


/*
 * Update countdown every second.
 */
setInterval(
    updateCountdown,
    1000
);

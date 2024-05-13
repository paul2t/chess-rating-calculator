
var accumulator=new Array();
var last_rating_change=0.0;

document.getElementById("input-player-rating").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-opponent-rating").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-score").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-k-factor").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-accumulate").addEventListener("click", (event) => on_accumulate());
document.getElementById("input-decumulate").addEventListener("click", (event) => on_decumulate());
init_from_url_parameter();

function on_accumulate() {
    accumulator.push(last_rating_change);
    on_ratings_params_changed();
}

function on_decumulate() {
    accumulator.pop();
    on_ratings_params_changed();
}

function init_from_url_parameter() {
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const rating = url_params.get('rating');
    const opponent = url_params.get('opponent');
    const score = url_params.get('score');
    const k = url_params.get('k');
    const accum = url_params.get('accum');
    
    if (rating != null)
        document.getElementById("input-player-rating").value = rating;
    if (opponent != null)
        document.getElementById("input-opponent-rating").value = opponent;
    if (score != null)
        document.getElementById("input-score").value = score;
    if (k != null)
        document.getElementById("input-k-factor").value = k;
    if (accum != null && accum.length > 0)
        accumulator = accum.split(';').map(Number);

    update_ratings();
}

function on_ratings_params_changed() {
    const input_player_rating = document.getElementById("input-player-rating").value;
    const input_opponent_rating = document.getElementById("input-opponent-rating").value;
    const input_score = document.getElementById("input-score").value;
    const input_k_factor = document.getElementById("input-k-factor").value;

    let params = new URLSearchParams();
    if (input_player_rating != "")
        params.set('rating', input_player_rating)
    if (input_opponent_rating != "")
        params.set('opponent', input_opponent_rating)
    if (input_score != "")
        params.set('score', input_score)
    if (input_k_factor != "")
        params.set('k', input_k_factor)
    if (input_k_factor != "")
        params.set('accum', accumulator.join(';'))
    const new_url = `${location.pathname}?${params}`;
    history.replaceState(null, '', new_url);

    update_ratings_with(input_player_rating, input_opponent_rating, input_score, input_k_factor);
}

function update_ratings() {
    const input_player_rating = document.getElementById("input-player-rating").value;
    const input_opponent_rating = document.getElementById("input-opponent-rating").value;
    const input_score = document.getElementById("input-score").value;
    const input_k_factor = document.getElementById("input-k-factor").value;

    update_ratings_with(input_player_rating, input_opponent_rating, input_score, input_k_factor);
}

function append_chg(output, value, first = false) {
    if (value >= 0) {
        if (!first)
            output.innerText += " + ";
    }
    else {
        if (first)
            output.innerText += " -";
        else
            output.innerText += " - ";
    }
    const gain = Math.abs(value);
    output.innerText += gain.toFixed(1);
}

function update_ratings_with(player_rating, opponent_rating, score, k_factor) {
    const output_win_lose = document.getElementById("output-win-lose");
    const output_rating_change = document.getElementById("output-score-change");
    const output_new_rating = document.getElementById("output-new-score");

    const rating_change = compute_rating_change(player_rating, opponent_rating, score, k_factor);
    last_rating_change = rating_change / k_factor;

    let accum_rating_change = rating_change;
    for (const it of accumulator) {
        accum_rating_change += it * k_factor;
    }

    const new_rating = +player_rating + accum_rating_change;

    if (accum_rating_change >= 0)
        output_win_lose.innerText = "win";
    else
        output_win_lose.innerText = "lose";
    const gain = Math.abs(new_rating - player_rating);

    output_rating_change.innerText = "";
    if (accumulator.length > 0) {
        let first = true;
        for (const it of accumulator) {
            append_chg(output_rating_change, it * k_factor, first);
            first = false;
        }
        append_chg(output_rating_change, rating_change, first);
        output_rating_change.innerText += " = ";
    }
    output_rating_change.innerText += gain.toFixed(1);
    
    output_new_rating.innerText = new_rating.toFixed(0);
}

function compute_rating_change(player_rating, opponent_rating, score, k) {
    return k * (score - (1 / (1 + Math.pow(10, (opponent_rating - player_rating) / 400))));
}

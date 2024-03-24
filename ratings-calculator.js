


document.getElementById("input-player-rating").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-opponent-rating").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-score").addEventListener("change", (event) => on_ratings_params_changed());
document.getElementById("input-k-factor").addEventListener("change", (event) => on_ratings_params_changed());
init_from_url_parameter();


function init_from_url_parameter() {
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const rating = url_params.get('rating');
    const opponent = url_params.get('opponent');
    const score = url_params.get('score');
    const k = url_params.get('k');
    
    if (rating != null)
        document.getElementById("input-player-rating").value = rating;
    if (opponent != null)
        document.getElementById("input-opponent-rating").value = opponent;
    if (score != null)
        document.getElementById("input-score").value = score;
    if (k != null)
        document.getElementById("input-k-factor").value = k;

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

function update_ratings_with(player_rating, opponent_rating, score, k_factor) {
    const output_win_lose = document.getElementById("output-win-lose");
    const output_rating_change = document.getElementById("output-score-change");
    const output_new_rating = document.getElementById("output-new-score");

    const rating_change = compute_rating_change(player_rating, opponent_rating, score, k_factor);
    const new_rating = +player_rating + rating_change;

    if (rating_change >= 0)
        output_win_lose.innerText = "win";
    else
        output_win_lose.innerText = "lose";
    const gain = Math.abs(new_rating - player_rating);
    output_rating_change.innerText = gain.toFixed(0);
    output_new_rating.innerText = new_rating.toFixed(0);
}

function compute_rating_change(player_rating, opponent_rating, score, k) {
    return k * (score - (1 / (1 + Math.pow(10, (opponent_rating - player_rating) / 400))));
}

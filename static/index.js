$(document).ready(function () {
    const recipeBtn = document.getElementById("reci");

    recipeBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent traditional form submission

        const feel = $("#sym").val();
        const mood = $("#mood").val();
        const taste = $("#taste").val();

        // Validate input
        if (!feel || !mood || !taste) {
            alert("Please fill in all fields.");
            return;
        }
        $('#loading').show()
        $("#result").html(""); // Clear previous results
        $("#youtube").html("");

        // Prepare data for the POST request
        const formData = {
            feel_val: feel,
            mood_val: mood,
            taste_val: taste,
        };

        // Send an AJAX POST request
        $.ajax({
            url: "/recipe_gen",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                $('#loading').hide();
                if (response.error) {
                    $("#result").html('<p style="color:red;">' + response.error + "</p>");
                    return;
                }
                const recipeText = response.Recipe;
                $("#result").html(`<pre id="bio-data">${recipeText}</pre>`);
                typewriterEffect('#bio-data');
                $('#youtube').append(`<p> YOUTUBE SUGGESTIONS <p>`)
                if (response.Youtube && response.Youtube.length > 0) {
                        response.Youtube.forEach(video => {
                            $("#youtube").append(`
                                <div class="youtube-card">
                                    <img src="${video.thumbnail}" alt="${video.title}">
                                    <p>${video.title}</p>
                                    <a href="${video.url}" target="_blank">Watch Now</a>
                                </div>
                            `);
                        });
                    }
                },
                error: function () {
                    $('#loading').hide();
                    $("#result").html('<p style="color:red;">An error occurred. Please try again.</p>');
                }
            });
        });
    });

function typewriterEffect(element) {
    var text = $(element).text();
    var index = 0;
    $(element).text(""); // Clear the existing text

    function type() {
        if (index < text.length) {
            $(element).append(text.charAt(index));
            index++;
            setTimeout(type, 5); // Adjust speed here (in ms)
        }
    }

    type(); // Start typing effect
}

// Autocomplete function
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Symptoms list
var symptoms = [
    "Sore throat", "Can’t sleep", "Bloated", "Low energy", "Stress", "Cold",
    "Hangover", "Cravings", "Heartburn", "Anxiety", "Headache", "Brain fog",
    "Allergies", "Nausea", "Mood swings", "Muscle pain", "Indigestion",
    "Menstrual cramps", "Acid reflux", "Joint pain", "Cough", "Detox",
    "Insomnia", "Fatigue", "Constipation", "Immune boost", "Skin glow",
    "Bad breath", "High blood pressure", "Inflammation", "Weight loss"
];

autocomplete(document.getElementById("sym"), symptoms);

const loading = document.getElementById('loading');
const result = document.getElementById('result');

// Function to show the loading element inside the result
function showLoading() {
    result.appendChild(loading); // Move loading inside result
    loading.style.display = 'block'; // Make it visible
}

// Function to hide the loading element and move it back
function hideLoading() {
    loading.style.display = 'none'; // Hide it
    document.body.appendChild(loading); // Move it back to the body (or original position)
}
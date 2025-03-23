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

        $("#result").html(""); // Clear previous results

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
                if (response.error) {
                    $("#result").html('<p style="color:red;">' + response.error + "</p>");
                    return;
                }
                const recipeText = response.Recipe;
                $("#result").html(`<pre id="bio-data">${recipeText}</pre>`);
            },
            error: function () {
                $("#result").html('<p style="color:red;">An error occurred. Please try again.</p>');
            },
        });
    });
});

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

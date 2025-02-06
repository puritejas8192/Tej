function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    if (pageId === "saved-ratios-page") {
        displaySavedRatios();
    }
}

function clearInputs() {
    document.querySelectorAll('input').forEach(input => input.value = '');
}

function calculateRatio() {
    let customerName = document.getElementById("customer-name").value;
    let powerRating = document.getElementById("power-rating").value + " " + document.getElementById("power-unit").value;
    let vectorGroup = document.getElementById("vector-group").value;
    let hvVoltage = parseFloat(document.getElementById("hv-voltage").value);
    let lvVoltage = parseFloat(document.getElementById("lv-voltage").value);
    let tapVariation = parseFloat(document.getElementById("tap-variation").value);
    let stepVariation = parseFloat(document.getElementById("step-variation").value);

    let baseRatio = hvVoltage / lvVoltage;

    if (vectorGroup.includes("Dyn")) {
        baseRatio *= Math.sqrt(3);
    } else if (vectorGroup.includes("Yd")) {
        baseRatio /= Math.sqrt(3);
    }

    let tapCount = Math.floor((2 * tapVariation) / stepVariation) + 1;
    let tapRatios = [];

    for (let i = 0; i < tapCount; i++) {
        let tapRatio = baseRatio * (1 + ((tapVariation - (i * stepVariation)) / 100));
        tapRatios.push(`Tap ${i + 1}: ${tapRatio.toFixed(4)}`);
    }

    document.getElementById("out-customer").innerText = customerName;
    document.getElementById("out-power").innerText = powerRating;
    document.getElementById("out-vector").innerText = vectorGroup;

    let tapResults = document.getElementById("tap-results");
    tapResults.innerHTML = tapRatios.map(ratio => `<li>${ratio}</li>`).join("");

    document.getElementById("save-btn").onclick = function() {
        saveData(customerName, powerRating, vectorGroup, tapRatios);
    };

    showPage("output-page");
}

function saveData(customerName, powerRating, vectorGroup, tapRatios) {
    let savedData = JSON.parse(localStorage.getItem("savedRatios")) || [];
    savedData.push({ customerName, powerRating, vectorGroup, tapRatios });
    localStorage.setItem("savedRatios", JSON.stringify(savedData));
    alert("Data saved successfully!");
}

function displaySavedRatios() {
    document.getElementById("saved-list").innerHTML = localStorage.getItem("savedRatios");
}

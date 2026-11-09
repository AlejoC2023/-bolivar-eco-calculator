// ============================================
// BOLIVAR ECO-CALCULATOR - actions.js
// Phase 5: JavaScript separated from HTML
// ============================================


// 1. LANGUAGE TRANSLATIONS

const translations = {
    en: {
        title: "Bolívar Eco-Calculator",
        subtitle: "Discover your environmental impact and make a difference!",
        calculatorTitle: "🌍 Calculate Your Weekly Impact",
        transportLabel: "🚍 Transportation to school:",
        transportPlaceholder: "Select transportation",
        bus: "Bus",
        privateCar: "Private car",
        sharedCar: "Shared car",
        bicycle: "Bicycle / Walking",
        paperLabel: "📄 Paper sheets used per day:",
        paperPlaceholder: "Enter number of sheets",
        recyclingLabel: "♻️ Recycling level:",
        recyclingPlaceholder: "Select recycling level",
        none: "None",
        low: "Low",
        medium: "Medium",
        high: "High",
        calculateButton: "🌿 Calculate Impact",
        resultsTitle: "📊 Your Weekly Results",
        co2Title: "Weekly CO₂",
        pointsTitle: "Eco-Points",
        printButton: "🖨️ Print / Save PDF Report",
        footer: "Colegio Bolívar | Building a greener future 🌎",
        success: "Calculation completed successfully!",
        error: "Please complete all fields with valid values.",
        certificateTitle: "ECOLOGICAL CERTIFICATE",
        certificateSubtitle: "Bolívar Eco-Calculator - Weekly Environmental Report",
        certificateMessage: "Your environmental impact results",
        transportDetail: "Transportation:",
        paperDetail: "Paper sheets per day:",
        recyclingDetail: "Recycling level:",
        dateDetail: "Report date:",
        certificateFooter: "Every small action makes a difference! 🌍\nColegio Bolívar",
        printError: "Please calculate your environmental impact before printing."
    },

    es: {
        title: "Bolívar Eco-Calculator",
        subtitle: "¡Descubre tu impacto ambiental y haz la diferencia!",
        calculatorTitle: "🌍 Calcula tu impacto semanal",
        transportLabel: "🚍 Transporte al colegio:",
        transportPlaceholder: "Selecciona el transporte",
        bus: "Bus",
        privateCar: "Carro particular",
        sharedCar: "Carro compartido",
        bicycle: "Bicicleta / Caminando",
        paperLabel: "📄 Hojas de papel utilizadas al día:",
        paperPlaceholder: "Ingresa el número de hojas",
        recyclingLabel: "♻️ Nivel de reciclaje:",
        recyclingPlaceholder: "Selecciona el nivel de reciclaje",
        none: "Ninguno",
        low: "Bajo",
        medium: "Medio",
        high: "Alto",
        calculateButton: "🌿 Calcular impacto",
        resultsTitle: "📊 Tus resultados semanales",
        co2Title: "CO₂ semanal",
        pointsTitle: "Eco-Points",
        printButton: "🖨️ Imprimir / Guardar reporte PDF",
        footer: "Colegio Bolívar | Construyendo un futuro más verde 🌎",
        success: "¡Cálculo completado correctamente!",
        error: "Por favor completa todos los campos con valores válidos.",
        certificateTitle: "CERTIFICADO ECOLÓGICO",
        certificateSubtitle: "Bolívar Eco-Calculator - Reporte ambiental semanal",
        certificateMessage: "Resultados de tu impacto ambiental",
        transportDetail: "Transporte:",
        paperDetail: "Hojas utilizadas al día:",
        recyclingDetail: "Nivel de reciclaje:",
        dateDetail: "Fecha del reporte:",
        certificateFooter: "¡Cada pequeña acción hace la diferencia! 🌍\nColegio Bolívar",
        printError: "Por favor calcula tu impacto ambiental antes de imprimir."
    }
};


// 2. APPLICATION STATE

let currentLanguage = "en";
let lastSimulation = null;


// 3. CHANGE LANGUAGE

function changeLanguage(language) {
    if (!translations[language]) {
        return;
    }

    currentLanguage = language;
    document.documentElement.lang = language;

    const dictionary = translations[language];

    // Translate all elements marked with data-i18n.
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");

        if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
            // textContent keeps the text safe and preserves line breaks in CSS.
            element.textContent = dictionary[key];
        }
    });

    // Translate input placeholders.
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");

        if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
            element.placeholder = dictionary[key];
        }
    });

    // Refresh the status message and certificate in the selected language.
    const message = document.getElementById("message");

    if (lastSimulation) {
        message.textContent = dictionary.success;
        updateCertificate();
    } else if (message.dataset.messageType === "error") {
        message.textContent = dictionary.error;
    }
}


// 4. CALCULATE ENVIRONMENTAL IMPACT

const form = document.getElementById("ecoForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const transport = document.getElementById("transport").value;
    const paperInput = document.getElementById("paper").value.trim();
    const paper = Number(paperInput);
    const recycling = document.getElementById("recycling").value;
    const message = document.getElementById("message");

    // Validate all fields.
    if (
        transport === "" ||
        recycling === "" ||
        paperInput === "" ||
        !Number.isInteger(paper) ||
        paper < 0
    ) {
        message.textContent = translations[currentLanguage].error;
        message.dataset.messageType = "error";
        lastSimulation = null;
        return;
    }

    message.dataset.messageType = "success";

    // Estimated calculation assumptions.
    const schoolDays = 5;
    const paperEmission = 0.004;

    const transportCO2 = Number(transport) * schoolDays;

    const paperCO2 =
        paper * schoolDays * paperEmission * (1 - Number(recycling));

    const totalCO2 = transportCO2 + paperCO2;

    // Eco-Points calculation.
    const transportPoints =
        transport === "0" ? 40 :
        transport === "1" ? 30 :
        transport === "1.5" ? 20 : 10;

    const paperPoints = Math.max(0, 30 - paper);
    const recyclingPoints = Number(recycling) * 30;

    const ecoPoints = Math.round(
        transportPoints + paperPoints + recyclingPoints
    );

    // Save simulation data.
    lastSimulation = {
        transport: transport,
        paper: paper,
        recycling: recycling,
        totalCO2: totalCO2,
        ecoPoints: ecoPoints
    };

    // Display results.
    document.getElementById("co2Result").textContent =
        totalCO2.toFixed(2) + " kg";

    document.getElementById("pointsResult").textContent =
        ecoPoints + " / 100";

    message.textContent = translations[currentLanguage].success;

    updateCertificate();
});


// 5. UPDATE PRINTABLE CERTIFICATE

function updateCertificate() {
    if (!lastSimulation) {
        return;
    }

    const data = lastSimulation;
    const language = currentLanguage;
    const dictionary = translations[language];

    const transportKey = {
        "1": "bus",
        "3": "privateCar",
        "1.5": "sharedCar",
        "0": "bicycle"
    };

    const recyclingKey = {
        "0": "none",
        "0.25": "low",
        "0.5": "medium",
        "0.50": "medium",
        "0.75": "high"
    };

    document.getElementById("printCO2").textContent =
        data.totalCO2.toFixed(2) + " kg";

    document.getElementById("printPoints").textContent =
        data.ecoPoints + " / 100";

    document.getElementById("printTransport").textContent =
        dictionary[transportKey[data.transport]];

    document.getElementById("printPaper").textContent =
        data.paper;

    document.getElementById("printRecycling").textContent =
        dictionary[recyclingKey[data.recycling]];

    document.getElementById("printDate").textContent =
        new Date().toLocaleDateString(
            language === "es" ? "es-CO" : "en-US"
        );
}


// 6. PRINT OR SAVE PDF

function printReport() {
    if (!lastSimulation) {
        alert(translations[currentLanguage].printError);
        return;
    }

    updateCertificate();
    window.print();
}


// 7. CONNECT BUTTON AND LANGUAGE SELECTOR

const languageSelect = document.getElementById("language");
const printButton = document.getElementById("printButton");

languageSelect.addEventListener("change", function () {
    changeLanguage(this.value);
});

printButton.addEventListener("click", printReport);


// 8. INITIALIZE THE APPLICATION

changeLanguage(languageSelect.value);







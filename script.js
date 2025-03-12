// Taux de conversion EUR/XOF (1 EUR = environ 655.957 XOF)
const EUR_TO_XOF = 655.957;
let currentCurrency = '€';
let currentRegion = 'europe';

// Mettre à jour l'affichage de la durée du prêt
function updateTermValue() {
    const termSlider = document.getElementById('loan-term');
    const termValue = document.getElementById('term-value');
    termValue.textContent = `${termSlider.value} ans`;
}

// Mettre à jour la devise en fonction de la région
function updateCurrency() {
    const regionSelect = document.getElementById('region');
    currentRegion = regionSelect.value;
    
    if (currentRegion === 'europe') {
        currentCurrency = '€';
        document.body.classList.remove('west-africa-mode');
    } else {
        currentCurrency = 'FCFA';
        document.body.classList.add('west-africa-mode');
    }
    
    // Mettre à jour le symbole de devise affiché
    document.getElementById('currency-symbol').textContent = currentCurrency === '€' ? '€' : 'FCFA';
    
    // Ajuster les taux d'intérêt en fonction de la région
    adjustRegionalRates();
}

// Ajuster les taux et frais en fonction de la région
function adjustRegionalRates() {
    const interestRateInput = document.getElementById('interest-rate');
    const applicationFeeInput = document.getElementById('application-fee');
    const insuranceFeeInput = document.getElementById('insurance-fee');
    const guaranteeFeeInput = document.getElementById('guarantee-fee');
    
    if (currentRegion === 'west-africa') {
        // Les taux sont généralement plus élevés en Afrique de l'Ouest
        interestRateInput.value = (parseFloat(interestRateInput.value) + 2.5).toFixed(1);
        applicationFeeInput.value = (parseFloat(applicationFeeInput.value) + 0.5).toFixed(1);
        insuranceFeeInput.value = (parseFloat(insuranceFeeInput.value) + 0.2).toFixed(2);
        guaranteeFeeInput.value = (parseFloat(guaranteeFeeInput.value) + 0.5).toFixed(1);
    } else {
        // Réinitialiser aux valeurs par défaut pour l'Europe
        interestRateInput.value = '3.5';
        applicationFeeInput.value = '1.0';
        insuranceFeeInput.value = '0.36';
        guaranteeFeeInput.value = '0.5';
    }
}

// Formater les montants en fonction de la devise
function formatCurrency(amount) {
    if (currentCurrency === '€') {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    } else {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
    }
}

// Calculer les mensualités avec la formule de l'annuité
function calculatePayment(principal, annualRate, termYears, paymentsPerYear) {
    const rate = annualRate / 100 / paymentsPerYear;
    const nPayments = termYears * paymentsPerYear;
    
    if (rate === 0) {
        return principal / nPayments;
    }
    
    return principal * rate * Math.pow(1 + rate, nPayments) / (Math.pow(1 + rate, nPayments) - 1);
}

// Générer le tableau d'amortissement
function generateAmortizationTable(principal, annualRate, termYears, paymentsPerYear, insuranceRate) {
    const tableBody = document.getElementById('amortization-table-body');
    tableBody.innerHTML = '';
    
    const rate = annualRate / 100 / paymentsPerYear;
    const nPayments = termYears * paymentsPerYear;
    const payment = calculatePayment(principal, annualRate, termYears, paymentsPerYear);
    
    // Calculer le montant mensuel de l'assurance
    const monthlyInsurance = (principal * insuranceRate / 100) / paymentsPerYear;
    
    let remainingPrincipal = principal;
    
    // Générer les lignes du tableau
    for (let i = 1; i <= nPayments; i++) {
        const interest = remainingPrincipal * rate;
        const principalPart = payment - interest;
        remainingPrincipal -= principalPart;
        
        const row = document.createElement('tr');
        
        // Période
        let periodLabel;
        if (paymentsPerYear === 12) {
            const year = Math.floor((i - 1) / 12) + 1;
            const month = ((i - 1) % 12) + 1;
            periodLabel = `Année ${year}, Mois ${month}`;
        } else if (paymentsPerYear === 4) {
            const year = Math.floor((i - 1) / 4) + 1;
            const quarter = ((i - 1) % 4) + 1;
            periodLabel = `Année ${year}, Trim ${quarter}`;
        } else if (paymentsPerYear === 2) {
            const year = Math.floor((i - 1) / 2) + 1;
            const semester = ((i - 1) % 2) + 1;
            periodLabel = `Année ${year}, Sem ${semester}`;
        } else {
            periodLabel = `Année ${i}`;
        }
        
        // Ajouter les cellules
        row.innerHTML = `
            <td>${periodLabel}</td>
            <td>${formatCurrency(payment + monthlyInsurance)}</td>
            <td>${formatCurrency(principalPart)}</td>
            <td>${formatCurrency(interest)}</td>
            <td>${formatCurrency(monthlyInsurance)}</td>
            <td>${formatCurrency(Math.max(0, remainingPrincipal))}</td>
        `;
        
        tableBody.appendChild(row);
    }
}
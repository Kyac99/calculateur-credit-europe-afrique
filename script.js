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

// Comparer différentes options de prêt
function compareOptions() {
    const tableBody = document.getElementById('comparison-table-body');
    tableBody.innerHTML = '';
    
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const baseTermYears = parseFloat(document.getElementById('loan-term').value);
    const baseRate = parseFloat(document.getElementById('interest-rate').value);
    
    const compareTermYears = parseFloat(document.getElementById('compare-term').value);
    const compareRate = parseFloat(document.getElementById('compare-rate').value);
    
    const paymentFrequency = getPaymentFrequency();
    const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
    
    // Option de base (sélectionnée par l'utilisateur)
    const basePayment = calculatePayment(loanAmount, baseRate, baseTermYears, paymentsPerYear);
    const baseTotalInterest = (basePayment * baseTermYears * paymentsPerYear) - loanAmount;
    const baseTotalCost = loanAmount + baseTotalInterest + calculateFees(loanAmount, baseTermYears);
    
    // Option avec un terme différent
    const termPayment = calculatePayment(loanAmount, baseRate, compareTermYears, paymentsPerYear);
    const termTotalInterest = (termPayment * compareTermYears * paymentsPerYear) - loanAmount;
    const termTotalCost = loanAmount + termTotalInterest + calculateFees(loanAmount, compareTermYears);
    const termDifference = termTotalCost - baseTotalCost;
    
    // Option avec un taux différent
    const ratePayment = calculatePayment(loanAmount, compareRate, baseTermYears, paymentsPerYear);
    const rateTotalInterest = (ratePayment * baseTermYears * paymentsPerYear) - loanAmount;
    const rateTotalCost = loanAmount + rateTotalInterest + calculateFees(loanAmount, baseTermYears);
    const rateDifference = rateTotalCost - baseTotalCost;
    
    // Option avec les deux différents
    const bothPayment = calculatePayment(loanAmount, compareRate, compareTermYears, paymentsPerYear);
    const bothTotalInterest = (bothPayment * compareTermYears * paymentsPerYear) - loanAmount;
    const bothTotalCost = loanAmount + bothTotalInterest + calculateFees(loanAmount, compareTermYears);
    const bothDifference = bothTotalCost - baseTotalCost;
    
    // Ajouter les options au tableau
    const options = [
        {
            name: `Actuel (${baseTermYears} ans, ${baseRate}%)`,
            payment: basePayment,
            interest: baseTotalInterest,
            cost: baseTotalCost,
            difference: 0
        },
        {
            name: `Durée: ${compareTermYears} ans`,
            payment: termPayment,
            interest: termTotalInterest,
            cost: termTotalCost,
            difference: termDifference
        },
        {
            name: `Taux: ${compareRate}%`,
            payment: ratePayment,
            interest: rateTotalInterest,
            cost: rateTotalCost,
            difference: rateDifference
        },
        {
            name: `${compareTermYears} ans, ${compareRate}%`,
            payment: bothPayment,
            interest: bothTotalInterest,
            cost: bothTotalCost,
            difference: bothDifference
        }
    ];
    
    // Remplir le tableau de comparaison
    options.forEach(option => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${option.name}</td>
            <td>${formatCurrency(option.payment)}</td>
            <td>${formatCurrency(option.interest)}</td>
            <td>${formatCurrency(option.cost)}</td>
            <td style="color: ${option.difference > 0 ? 'red' : 'green'}">
                ${option.difference === 0 ? '-' : (option.difference > 0 ? '+' : '') + formatCurrency(option.difference)}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Obtenir la fréquence de paiement en nombre par an
function getPaymentsPerYear(frequency) {
    switch (frequency) {
        case 'monthly': return 12;
        case 'quarterly': return 4;
        case 'semi-annual': return 2;
        case 'annual': return 1;
        default: return 12;
    }
}

// Obtenir la fréquence sélectionnée
function getPaymentFrequency() {
    return document.getElementById('payment-frequency').value;
}

// Calculer tous les frais additionnels
function calculateFees(principal, termYears) {
    const applicationFeePercent = parseFloat(document.getElementById('application-fee').value);
    const insuranceFeePercent = parseFloat(document.getElementById('insurance-fee').value);
    const guaranteeFeePercent = parseFloat(document.getElementById('guarantee-fee').value);
    
    const applicationFee = principal * (applicationFeePercent / 100);
    const insuranceFee = principal * (insuranceFeePercent / 100) * termYears;
    const guaranteeFee = principal * (guaranteeFeePercent / 100);
    
    return applicationFee + insuranceFee + guaranteeFee;
}

// Calculer le prêt et mettre à jour l'interface
function calculateLoan() {
    // Ajouter une animation lors du calcul
    document.querySelector('.input-section').classList.add('calculating');
    setTimeout(() => {
        document.querySelector('.input-section').classList.remove('calculating');
    }, 500);
    
    // Récupérer les valeurs
    let loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const termYears = parseFloat(document.getElementById('loan-term').value);
    const annualRate = parseFloat(document.getElementById('interest-rate').value);
    const paymentFrequency = getPaymentFrequency();
    const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
    
    // Si on est en FCFA, convertir en euros pour le calcul
    if (currentCurrency === 'FCFA') {
        loanAmount = loanAmount / EUR_TO_XOF;
    }
    
    // Calculer le paiement périodique
    const payment = calculatePayment(loanAmount, annualRate, termYears, paymentsPerYear);
    
    // Calculer les intérêts totaux
    const totalInterest = (payment * termYears * paymentsPerYear) - loanAmount;
    
    // Calculer les frais additionnels
    const applicationFeePercent = parseFloat(document.getElementById('application-fee').value);
    const insuranceFeePercent = parseFloat(document.getElementById('insurance-fee').value);
    const guaranteeFeePercent = parseFloat(document.getElementById('guarantee-fee').value);
    
    const applicationFee = loanAmount * (applicationFeePercent / 100);
    const insuranceFee = loanAmount * (insuranceFeePercent / 100) * termYears;
    const guaranteeFee = loanAmount * (guaranteeFeePercent / 100);
    
    // Calculer le coût total
    const totalFees = applicationFee + insuranceFee + guaranteeFee;
    const totalCost = loanAmount + totalInterest + totalFees;
    
    // Mettre à jour le résumé
    let displayAmount = loanAmount;
    if (currentCurrency === 'FCFA') {
        displayAmount = loanAmount * EUR_TO_XOF;
    }
    
    document.getElementById('summary-amount').textContent = formatCurrency(displayAmount);
    document.getElementById('summary-term').textContent = `${termYears} ans`;
    document.getElementById('summary-rate').textContent = `${annualRate}%`;
    document.getElementById('summary-payment').textContent = formatCurrency(currentCurrency === 'FCFA' ? payment * EUR_TO_XOF : payment);
    
    // Mettre à jour les détails des frais
    document.getElementById('total-interest').textContent = formatCurrency(currentCurrency === 'FCFA' ? totalInterest * EUR_TO_XOF : totalInterest);
    document.getElementById('application-fee-amount').textContent = formatCurrency(currentCurrency === 'FCFA' ? applicationFee * EUR_TO_XOF : applicationFee);
    document.getElementById('insurance-amount').textContent = formatCurrency(currentCurrency === 'FCFA' ? insuranceFee * EUR_TO_XOF : insuranceFee);
    document.getElementById('guarantee-fee-amount').textContent = formatCurrency(currentCurrency === 'FCFA' ? guaranteeFee * EUR_TO_XOF : guaranteeFee);
    document.getElementById('total-fees').textContent = formatCurrency(currentCurrency === 'FCFA' ? totalFees * EUR_TO_XOF : totalFees);
    document.getElementById('summary-total-cost').textContent = formatCurrency(currentCurrency === 'FCFA' ? totalCost * EUR_TO_XOF : totalCost);
    
    // Ajouter des classes spécifiques selon le taux d'intérêt
    const rateDisplay = document.getElementById('summary-rate');
    if (annualRate > 7) {
        rateDisplay.className = "high-rate";
    } else if (annualRate > 4) {
        rateDisplay.className = "normal-rate";
    } else {
        rateDisplay.className = "low-rate";
    }
    
    // Générer le tableau d'amortissement
    generateAmortizationTable(loanAmount, annualRate, termYears, paymentsPerYear, insuranceFeePercent);
    
    // Comparer différentes options
    compareOptions();
}

// Afficher l'onglet sélectionné
function showTab(tabId) {
    // Masquer tous les onglets
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }
    
    // Supprimer la classe active de tous les onglets
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // Afficher l'onglet sélectionné
    document.getElementById(tabId).style.display = 'block';
    
    // Ajouter la classe active à l'onglet sélectionné
    const selectedTab = document.querySelector(`.tab[onclick="showTab('${tabId}')"]`);
    selectedTab.classList.add('active');
}

// Initialiser la calculatrice
window.onload = function() {
    updateCurrency();
    updateTermValue();
    calculateLoan();
    
    // Ajouter des écouteurs d'événements pour la mise à jour en temps réel
    document.getElementById('loan-amount').addEventListener('input', calculateLoan);
    document.getElementById('loan-term').addEventListener('input', function() {
        updateTermValue();
        calculateLoan();
    });
    document.getElementById('interest-rate').addEventListener('input', calculateLoan);
    document.getElementById('payment-frequency').addEventListener('change', calculateLoan);
    document.getElementById('application-fee').addEventListener('input', calculateLoan);
    document.getElementById('insurance-fee').addEventListener('input', calculateLoan);
    document.getElementById('guarantee-fee').addEventListener('input', calculateLoan);
    document.getElementById('loan-type').addEventListener('change', adjustLoanTypeParams);
}

// Ajuster les paramètres en fonction du type de prêt
function adjustLoanTypeParams() {
    const loanType = document.getElementById('loan-type').value;
    const interestRateInput = document.getElementById('interest-rate');
    const termInput = document.getElementById('loan-term');
    const amountInput = document.getElementById('loan-amount');
    
    switch(loanType) {
        case 'personal':
            // Prêt personnel: taux plus élevé, durée plus courte
            interestRateInput.value = currentRegion === 'europe' ? 4.5 : 7.0;
            termInput.value = 5;
            amountInput.value = 20000;
            break;
        case 'mortgage':
            // Prêt immobilier: taux plus bas, durée plus longue
            interestRateInput.value = currentRegion === 'europe' ? 3.0 : 5.5;
            termInput.value = 20;
            amountInput.value = 200000;
            break;
        case 'auto':
            // Prêt auto: taux moyen, durée moyenne
            interestRateInput.value = currentRegion === 'europe' ? 3.8 : 6.3;
            termInput.value = 6;
            amountInput.value = 15000;
            break;
        case 'business':
            // Prêt professionnel: taux variable selon risque
            interestRateInput.value = currentRegion === 'europe' ? 4.0 : 6.5;
            termInput.value = 10;
            amountInput.value = 50000;
            break;
    }
    
    updateTermValue();
    calculateLoan();
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("converter-form");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const resultDiv = document.getElementById("result");

    const apiKey = 'MY_API_KEY'; 
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/`;

    // Fetch and populate the currency options
    fetch(`${apiUrl}USD`)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            populateSelectOptions(currencies);
        })
        .catch(error => console.error('Error fetching exchange rates:', error));

    function populateSelectOptions(currencies) {
        currencies.forEach(currency => {
            const optionFrom = document.createElement("option");
            const optionTo = document.createElement("option");
            optionFrom.value = currency;
            optionTo.value = currency;
            optionFrom.textContent = currency;
            optionTo.textContent = currency;
            fromCurrencySelect.appendChild(optionFrom);
            toCurrencySelect.appendChild(optionTo);
        });
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const amount = parseFloat(document.getElementById("amount").value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        convertCurrency(amount, fromCurrency, toCurrency);
    });

    function convertCurrency(amount, fromCurrency, toCurrency) {
        fetch(`${apiUrl}${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[toCurrency];
                if (!rate) {
                    resultDiv.textContent = `Conversion rate for ${toCurrency} not available.`;
                    return;
                }
                const convertedAmount = (amount * rate).toFixed(2);
                resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            })
            .catch(error => console.error('Error converting currency:', error));
    }
});

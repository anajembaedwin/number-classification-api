const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Helper functions
const isPrime = (n) => {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
};

const isPerfect = (n) => {
    if (n <= 1) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            sum += i;
            const complement = n / i;
            if (complement !== i) sum += complement;
        }
    }
    return sum === n;
};

const isArmstrong = (n) => {
    const str = Math.abs(n).toString();
    const length = str.length;
    return str.split('').reduce((acc, digit) => 
        acc + Math.pow(parseInt(digit, 10), length), 0) === Math.abs(n);
};

const digitSum = (n) => {
    return Math.abs(n).toString().split('').reduce((acc, digit) => 
        acc + parseInt(digit, 10), 0);
};

// API Endpoint
app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;
    
    if (!number || isNaN(number)) {
        return res.status(400).json({ number: number || 'undefined', error: true });
    }

    const num = parseInt(number, 10);
    
    try {
        const [factResponse] = await Promise.all([
            axios.get(`http://numbersapi.com/${num}/math`, { timeout: 500 }),
        ]);

        const responseData = {
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: [
                ...(isArmstrong(num) ? ['armstrong'] : []),
                num % 2 === 0 ? 'even' : 'odd'
            ],
            digit_sum: digitSum(num),
            fun_fact: factResponse.data
        };

        res.json(responseData);
    } catch (error) {
        const fallbackFact = `No fun fact available for ${num}`;
        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: [
                ...(isArmstrong(num) ? ['armstrong'] : []),
                num % 2 === 0 ? 'even' : 'odd'
            ],
            digit_sum: digitSum(num),
            fun_fact: error.code === 'ECONNABORTED' ? 'Fact request timed out' : fallbackFact
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
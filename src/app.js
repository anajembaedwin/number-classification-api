const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Improved helper functions
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
    const sqrt = Math.sqrt(n);
    for (let i = 2; i <= sqrt; i++) {
        if (n % i === 0) {
            sum += i;
            const complement = n / i;
            if (complement !== i) sum += complement;
        }
    }
    return sum === n;
};

const isArmstrong = (n) => {
    const absolute = Math.abs(n);
    const str = absolute.toString();
    const length = str.length;
    return str.split('').reduce((acc, digit) => 
        acc + Math.pow(parseInt(digit, 10), length), 0) === absolute;
};

const digitSum = (n) => {
    return Math.abs(n).toString().split('').reduce((acc, digit) => 
        acc + parseInt(digit, 10), 0);
};

// Enhanced API endpoint
app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;
    
    // Strict validation for integers (positive/negative/zero)
    if (typeof number === 'undefined' || !/^-?\d+$/.test(number)) {
        return res.status(400).json({
            number: number || "undefined",
            error: true
        });
    }

    const num = parseInt(number, 10);
    
    try {
        // Fetch fun fact with proper error handling
        const factResponse = await axios.get(
            `http://numbersapi.com/${num}/math?json`,
            { timeout: 500 }
        );

        return res.status(200).json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: [
                ...(isArmstrong(num) ? ['armstrong'] : []),
                num % 2 === 0 ? 'even' : 'odd'
            ],
            digit_sum: digitSum(num),
            fun_fact: factResponse.data.text || `No fun fact available for ${num}`
        });
        
    } catch (error) {
        // Handle API errors while still returning classification
        return res.status(200).json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: [
                ...(isArmstrong(num) ? ['armstrong'] : []),
                num % 2 === 0 ? 'even' : 'odd'
            ],
            digit_sum: digitSum(num),
            fun_fact: error.response?.status === 404 
                ? `No fun fact available for ${num}`
                : "Could not retrieve fun fact"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
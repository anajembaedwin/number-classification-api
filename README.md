# Number Classification API

An API that provides mathematical properties and interesting facts about numbers.

## Features
- Prime number check
- Perfect number check
- Armstrong number check
- Digit sum calculation
- Number parity (even/odd)
- Fun facts from NumbersAPI

## Installation
```bash
git clone https://github.com/anajembaedwin/number-classification-api.git
cd number-classification-api
npm install
```

## Usage
```bash
npm run dev  # Development
npm start    # Production
```

## API Endpoint
```bash
GET /api/classify-number?number=<integer>
```

- Example Request
```bash
curl http://localhost:3000/api/classify-number?number=371
```

- Example Response
```bash
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

## Deployment
Deployed on [Render] at [your-deployment-link]

## Dependencies
- Express.js
- Axios
- CORS

## Testing
Use Postman or curl to test:
```bash
# Valid request
curl https://your-api-url/api/classify-number?number=28

# Invalid request
curl https://your-api-url/api/classify-number?number=abc
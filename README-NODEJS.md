# Node.js Account Management System

This is the modernized Node.js version of the COBOL Account Management System. It preserves all business logic and functionality from the original COBOL application while implementing modern JavaScript patterns and best practices.

## Overview

The application provides basic banking operations through an interactive command-line interface:
- **View Balance** - Display current account balance
- **Credit Account** - Add funds to the account
- **Debit Account** - Withdraw funds with overdraft protection
- **Exit** - Safely terminate the application

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

### Setup

1. Navigate to the project directory:
```bash
cd /path/to/modernize-legacy-cobol-app
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Start the Application

Using npm script (recommended):
```bash
npm start
```

Or directly with Node.js:
```bash
node main.js
```

### Application Workflow

1. **Start**: The application displays a menu with 4 options
2. **Select**: Choose an operation (1-4)
3. **Execute**: The application processes your request
4. **Repeat**: Menu redisplays until you choose to exit

### Example Session

```
--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 
1
Current balance: 1000.00

--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 
2
Enter credit amount: 
500
Amount credited. New balance: 1500.00

--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 
3
Enter debit amount: 
300
Amount debited. New balance: 1200.00

--------------------------------
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 
4
Exiting the program. Goodbye!
```

## Architecture

The application follows a three-tier architecture with clear separation of concerns:

### File Structure

```
├── main.js         - Main program logic and user interface (Presentation Layer)
├── operations.js   - Business operations module (Business Logic Layer)
├── data.js         - Data management module (Data Access Layer)
├── package.json    - Project configuration and dependencies
└── README-NODEJS.md - This file
```

### Module Descriptions

#### main.js (Presentation Layer)
- Entry point for the application
- Displays menu and captures user input
- Routes requests to appropriate business logic handlers
- Equivalent to `main.cob`

#### operations.js (Business Logic Layer)
- Implements credit, debit, and view balance operations
- Enforces business rules and validation
- Handles transaction processing
- Equivalent to `operations.cob`

#### data.js (Data Access Layer)
- Manages account balance storage
- Provides read/write operations for balance data
- Maintains state during application session
- Equivalent to `data.cob`

## Business Rules

The Node.js application preserves all business rules from the original COBOL system:

| Rule | Description |
|------|-------------|
| **Initial Balance** | Starting balance is always $1,000.00 |
| **Overdraft Protection** | Balance cannot go negative (debit rejected if amount > balance) |
| **Balance Range** | Valid range: $0.00 to $999,999.99 |
| **Decimal Precision** | Two decimal places (cents) |
| **Zero Amounts** | Zero amount credits/debits are allowed but don't change balance |
| **Session Persistence** | Balance persists across operations during the session |
| **Menu Validation** | Only choices 1-4 are valid |

## Technical Details

### Dependencies

- **readline-sync** (v1.4.10): Provides synchronous command-line input functionality, similar to COBOL's ACCEPT statement

### Design Patterns

- **Singleton Pattern**: Data and operations modules are exported as singleton instances to maintain state
- **Module Pattern**: Each file exports functionality as a reusable module
- **Command Pattern**: User choices trigger specific operation commands

### Conversion Mapping

| COBOL Construct | Node.js Equivalent |
|----------------|-------------------|
| `CALL 'Operations'` | `operations.processOperation()` |
| `ACCEPT` | `readlineSync.question()` |
| `DISPLAY` | `console.log()` |
| `EVALUATE` | `switch/case` |
| `PERFORM UNTIL` | `while` loop |
| `PIC 9(6)V99` | JavaScript `number` with `.toFixed(2)` |
| `WORKING-STORAGE` | Class properties |

## Testing

The application has comprehensive automated tests using the Jest testing framework. All 39 test cases from `TESTPLAN.md` have been implemented with over 170 automated tests covering unit and integration testing.

### Test Structure

```
├── data.test.js         - Unit tests for data.js (Data Access Layer) - 25 tests
├── operations.test.js   - Unit tests for operations.js (Business Logic) - 64 tests
├── main.test.js         - Unit tests for main.js (Presentation Layer) - 48 tests
└── integration.test.js  - Integration tests (Complete Workflows) - 34 tests
```

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode (for development):**
```bash
npm run test:watch
```

**Generate coverage report:**
```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view detailed coverage information.

### Test Coverage

The test suite covers:

- ✅ **Initial State Tests** (TC-1.1.x): Verify initial balance of $1,000.00
- ✅ **View Balance Tests** (TC-1.2.x): Test balance display functionality
- ✅ **Credit Operations** (TC-1.3.x): Test adding funds with various amounts
- ✅ **Debit Operations** (TC-1.4.x): Test withdrawing funds and overdraft protection
- ✅ **Exit Functionality** (TC-1.5.x): Test graceful application termination
- ✅ **Boundary Tests** (TC-2.x): Test edge cases and limits
- ✅ **Input Validation** (TC-3.x): Test invalid menu choices and input handling
- ✅ **Integration Workflows** (TC-4.x): Test complete user scenarios

Target: **>80% code coverage** ✅

### Test Examples

**Unit Test Example (from data.test.js):**
```javascript
test('TC-1.1.1: should initialize with balance 1000.00', () => {
  const balance = dataInstance.readBalance();
  expect(balance).toBe(1000.00);
});
```

**Integration Test Example (from integration.test.js):**
```javascript
test('TC-4.1: should handle complete user workflow correctly', () => {
  // View, credit, view, debit, view - complete flow
  operations.viewBalance();
  expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
  
  readlineSync.question.mockReturnValueOnce('500.00');
  operations.creditAccount();
  expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
  // ... continues
});
```

### Manual Testing

To manually test the application, refer to the [TESTING-GUIDE.md](TESTING-GUIDE.md) for detailed test scenarios and expected outputs.

The application behavior has been validated against the comprehensive test plan documented in `TESTPLAN.md`. All 39 test cases covering functional, boundary, validation, and integration scenarios have been addressed.

1. **Test Initial Balance** (TC-1.1.1):
   - Start application
   - Select option 1
   - Verify balance shows 1000.00

2. **Test Credit Operation** (TC-1.3.1):
   - Select option 2
   - Enter amount: 500.00
   - Verify new balance: 1500.00

3. **Test Debit Operation** (TC-1.4.1):
   - Select option 3
   - Enter amount: 300.00
   - Verify new balance: 1200.00

4. **Test Insufficient Funds** (TC-1.4.5):
   - Select option 3
   - Enter amount greater than balance
   - Verify "Insufficient funds" message
   - Verify balance unchanged

5. **Test Exit** (TC-1.5.1):
   - Select option 4
   - Verify "Exiting the program. Goodbye!" message
   - Verify application terminates

## Limitations

- **No Data Persistence**: Balance resets to $1,000.00 on application restart (same as COBOL version)
- **No Transaction History**: No audit trail of operations (same as COBOL version)
- **Single Account**: Only one account supported (same as COBOL version)
- **Session-Based**: Balance only persists during application session (same as COBOL version)

## Future Enhancements

Potential improvements beyond the original COBOL functionality:
- Persistent storage (database or file system)
- Transaction history and logging
- Multi-account support
- User authentication
- Web-based interface
- RESTful API

## References

- **COBOL Source Code**: `main.cob`, `operations.cob`, `data.cob`
- **Business Logic Documentation**: `COBOL_DOCUMENTATION.md`
- **Architecture Diagrams**: `DIAGRAMS.md`
- **Test Plan**: `TESTPLAN.md`
- **Modernization Roadmap**: `MODERNIZATION_ROADMAP.md`

## Conversion Notes

This Node.js application is a faithful conversion of the original COBOL application with the following modernizations:

1. **ES6+ Syntax**: Uses modern JavaScript features (const/let, classes, arrow functions)
2. **Module System**: CommonJS modules with `require()` and `module.exports`
3. **Error Handling**: Proper input validation and error handling
4. **Code Organization**: Object-oriented design with classes
5. **Documentation**: Comprehensive inline comments explaining COBOL equivalents
6. **Formatting**: Uses `.toFixed(2)` for consistent decimal precision

All business logic has been preserved exactly as specified in the COBOL source code and validated against the test plan.

## Support

For issues or questions about this application, please refer to:
- Original COBOL documentation: `COBOL_DOCUMENTATION.md`
- Test plan: `TESTPLAN.md`
- Project repository: https://github.com/sukumarp2022/modernize-legacy-cobol-app

## License

MIT License - See LICENSE file for details

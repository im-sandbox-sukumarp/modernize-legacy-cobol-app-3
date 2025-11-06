# 📋 Comprehensive Test Plan for COBOL Account Management System

## Overview

This comprehensive test plan documents all business logic, validation rules, and expected behaviors for the COBOL Account Management System. It is designed to be technology-agnostic and can be used to validate both the legacy COBOL application and the modernized Node.js application.

**Purpose**: Ensure no functionality is lost during modernization and validate business logic with stakeholders.

**Target Audience**: Business stakeholders, QA team, development team

**Document Version**: 2.0 (Enhanced)

**Last Updated**: 2025-11-06

---

## Test Summary

| Category | Total Test Cases |
|----------|-----------------|
| Functional Tests | 20 |
| Boundary/Edge Cases | 8 |
| Validation Tests | 6 |
| Integration Tests | 5 |
| **Total** | **39** |

---

## Test Environment Setup

### Pre-conditions for All Tests
- COBOL application compiled successfully (or Node.js application installed)
- System has sufficient memory to run the application
- Console/terminal available for input/output
- Initial balance set to 1000.00 (default starting balance)

### Test Data Constraints
- Balance format: `PIC 9(6)V99` (Range: 0.00 to 999,999.99)
- Amount format: `PIC 9(6)V99` (Range: 0.00 to 999,999.99)
- Menu choice: Single digit (1-4)

---

## 1. Functional Test Cases

### 1.1 Initial State and Startup Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-1.1.1 | Verify Initial Balance on Startup | Application not running | 1. Start the application<br>2. Select option 1 to view balance | Application displays: "Current balance: 1000.00" | | | Default starting balance |
| TC-1.1.2 | Verify Menu Display on Startup | Application not running | 1. Start the application<br>2. Observe the menu | Application displays menu with 4 options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | Menu should be clearly formatted |

### 1.2 View Balance Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-1.2.1 | View Initial Balance | Application started, no transactions performed | 1. Select option 1 | Display: "Current balance: 1000.00" | | | First operation after startup |
| TC-1.2.2 | View Balance After Credit | Application started, credited 500.00 | 1. Credit account with 500.00<br>2. Select option 1 | Display: "Current balance: 1500.00" | | | Balance should reflect credit |
| TC-1.2.3 | View Balance After Debit | Application started, debited 200.00 | 1. Debit account with 200.00<br>2. Select option 1 | Display: "Current balance: 800.00" | | | Balance should reflect debit |
| TC-1.2.4 | View Balance Multiple Times | Application started | 1. Select option 1<br>2. Return to menu<br>3. Select option 1 again | Both times display same balance | | | Read-only operation, no side effects |

### 1.3 Credit Account Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-1.3.1 | Credit with Valid Amount | Application started, balance: 1000.00 | 1. Select option 2<br>2. Enter 500.00 | Display: "Amount credited. New balance: 1500.00" | | | Happy path |
| TC-1.3.2 | Credit with Small Amount | Application started, balance: 1000.00 | 1. Select option 2<br>2. Enter 0.01 | Display: "Amount credited. New balance: 1000.01" | | | Minimum meaningful credit |
| TC-1.3.3 | Credit with Zero Amount | Application started, balance: 1000.00 | 1. Select option 2<br>2. Enter 0.00 | Display: "Amount credited. New balance: 1000.00" | | | Zero credit allowed but no change |
| TC-1.3.4 | Credit with Large Amount | Application started, balance: 1000.00 | 1. Select option 2<br>2. Enter 50000.00 | Display: "Amount credited. New balance: 51000.00" | | | Large valid amount |
| TC-1.3.5 | Credit with Decimal Precision | Application started, balance: 1000.00 | 1. Select option 2<br>2. Enter 123.45 | Display: "Amount credited. New balance: 1123.45" | | | Decimal handling |

### 1.4 Debit Account Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-1.4.1 | Debit with Valid Amount | Application started, balance: 1000.00 | 1. Select option 3<br>2. Enter 300.00 | Display: "Amount debited. New balance: 700.00" | | | Happy path |
| TC-1.4.2 | Debit with Small Amount | Application started, balance: 1000.00 | 1. Select option 3<br>2. Enter 0.01 | Display: "Amount debited. New balance: 999.99" | | | Minimum meaningful debit |
| TC-1.4.3 | Debit with Zero Amount | Application started, balance: 1000.00 | 1. Select option 3<br>2. Enter 0.00 | Display: "Amount debited. New balance: 1000.00" | | | Zero debit allowed but no change |
| TC-1.4.4 | Debit Exact Balance Amount | Application started, balance: 1000.00 | 1. Select option 3<br>2. Enter 1000.00 | Display: "Amount debited. New balance: 0.00" | | | Balance becomes zero |
| TC-1.4.5 | Debit with Insufficient Funds | Application started, balance: 1000.00 | 1. Select option 3<br>2. Enter 1500.00 | Display: "Insufficient funds for this debit."<br>Balance remains: 1000.00 | | | Overdraft protection |
| TC-1.4.6 | Debit from Zero Balance | Balance: 0.00 | 1. Select option 3<br>2. Enter 50.00 | Display: "Insufficient funds for this debit."<br>Balance remains: 0.00 | | | Cannot debit from zero |
| TC-1.4.7 | Debit with Decimal Precision | Application started, balance: 1000.00 | 1. Select option 3<br>2. Enter 234.56 | Display: "Amount debited. New balance: 765.44" | | | Decimal handling |

### 1.5 Exit Application Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-1.5.1 | Exit from Main Menu | Application started | 1. Select option 4 | Display: "Exiting the program. Goodbye!"<br>Application terminates | | | Clean exit |
| TC-1.5.2 | Exit After Transactions | Performed several transactions | 1. Perform credit/debit<br>2. Select option 4 | Display: "Exiting the program. Goodbye!"<br>Application terminates | | | Exit at any time |

---

## 2. Boundary and Edge Case Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-2.1 | Credit Maximum Valid Amount | Balance: 0.00 | 1. Select option 2<br>2. Enter 999999.99 | Display: "Amount credited. New balance: 999999.99" | | | Maximum balance |
| TC-2.2 | Credit Near Maximum Balance | Balance: 999990.00 | 1. Select option 2<br>2. Enter 9.99 | Display: "Amount credited. New balance: 999999.99" | | | Reaching max balance |
| TC-2.3 | Credit Exceeding Maximum | Balance: 999990.00 | 1. Select option 2<br>2. Enter 20.00 | Error or truncation (implementation-dependent) | | | Overflow scenario |
| TC-2.4 | Debit Just Below Balance | Balance: 1000.00 | 1. Select option 3<br>2. Enter 999.99 | Display: "Amount debited. New balance: 0.01" | | | Nearly empty balance |
| TC-2.5 | Debit One Cent Over Balance | Balance: 1000.00 | 1. Select option 3<br>2. Enter 1000.01 | Display: "Insufficient funds for this debit."<br>Balance: 1000.00 | | | Just over limit |
| TC-2.6 | Multiple Small Credits | Balance: 1000.00 | 1. Credit 0.01 ten times | Balance: 1000.10 after all credits | | | Decimal accumulation |
| TC-2.7 | Alternating Credit/Debit | Balance: 1000.00 | 1. Credit 100.00<br>2. Debit 50.00<br>3. Credit 25.00<br>4. Debit 75.00 | Final balance: 1000.00 | | | Multiple operations |
| TC-2.8 | Large Number of Transactions | Balance: 1000.00 | Perform 50 credits of 10.00 each | Final balance: 1500.00 | | | System stability |

---

## 3. Input Validation Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-3.1 | Invalid Menu Choice - Zero | Application started | 1. Enter 0 at menu | Display: "Invalid choice, please select 1-4."<br>Redisplay menu | | | Out of range |
| TC-3.2 | Invalid Menu Choice - High Number | Application started | 1. Enter 5 at menu | Display: "Invalid choice, please select 1-4."<br>Redisplay menu | | | Out of range |
| TC-3.3 | Invalid Menu Choice - Letter | Application started | 1. Enter 'A' at menu | Error handling (implementation-dependent) | | | Non-numeric input |
| TC-3.4 | Invalid Amount - Negative | Credit/Debit screen | 1. Select option 2 or 3<br>2. Enter negative amount | Error or rejection (PIC 9 unsigned) | | | Negative not allowed |
| TC-3.5 | Invalid Amount - Non-numeric | Credit/Debit screen | 1. Select option 2 or 3<br>2. Enter letters/symbols | Error handling (implementation-dependent) | | | Invalid format |
| TC-3.6 | Amount with More Than 2 Decimals | Credit/Debit screen | 1. Select option 2 or 3<br>2. Enter 123.456 | Truncate or round to 123.46 | | | Decimal precision |

---

## 4. Integration and Workflow Tests

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-4.1 | Complete User Workflow | Application started | 1. View balance (1000.00)<br>2. Credit 500.00 (balance: 1500.00)<br>3. View balance (1500.00)<br>4. Debit 300.00 (balance: 1200.00)<br>5. View balance (1200.00)<br>6. Exit | All operations succeed with correct balances | | | Full happy path |
| TC-4.2 | Sequential Credits | Balance: 1000.00 | 1. Credit 100.00 (1100.00)<br>2. Credit 200.00 (1300.00)<br>3. Credit 50.00 (1350.00) | Final balance: 1350.00 | | | Multiple credits |
| TC-4.3 | Sequential Debits | Balance: 1000.00 | 1. Debit 100.00 (900.00)<br>2. Debit 200.00 (700.00)<br>3. Debit 50.00 (650.00) | Final balance: 650.00 | | | Multiple debits |
| TC-4.4 | Failed Debit Followed by Success | Balance: 500.00 | 1. Debit 600.00 (rejected)<br>2. View balance (500.00)<br>3. Debit 400.00 (success: 100.00) | Final balance: 100.00 | | | Rejection doesn't affect state |
| TC-4.5 | Balance Persistence Across Operations | Application started | 1. Credit 500.00<br>2. Return to menu<br>3. Debit 200.00<br>4. Return to menu<br>5. View balance | Balance: 1300.00 | | | State maintained |

---

## 5. Business Rule Validation Tests

### 5.1 Core Business Rules

| Rule ID | Business Rule | Test Case ID(s) | Validation Method |
|---------|--------------|-----------------|-------------------|
| BR-1 | Starting balance is always 1000.00 | TC-1.1.1 | Verify initial balance on startup |
| BR-2 | Balance cannot go negative (overdraft protection) | TC-1.4.5, TC-1.4.6, TC-2.5 | Attempt debit > balance, verify rejection |
| BR-3 | Balance range: 0.00 to 999,999.99 | TC-2.1, TC-2.2 | Test minimum and maximum values |
| BR-4 | Zero amount credits/debits are allowed | TC-1.3.3, TC-1.4.3 | Process zero amounts |
| BR-5 | Decimal precision is 2 places (cents) | TC-1.3.5, TC-1.4.7, TC-3.6 | Test decimal amounts |
| BR-6 | Read-Modify-Write transaction pattern | TC-4.1, TC-4.5 | Multiple operations maintain consistency |
| BR-7 | Balance persists across operations in session | TC-4.5 | Verify state maintenance |
| BR-8 | Menu choices limited to 1-4 | TC-3.1, TC-3.2 | Test invalid choices |

---

## 6. Test Coverage Matrix

### Feature Coverage

| Feature | Test Cases | Coverage |
|---------|-----------|----------|
| View Balance | TC-1.2.1 through TC-1.2.4 | ✅ Complete |
| Credit Account | TC-1.3.1 through TC-1.3.5 | ✅ Complete |
| Debit Account | TC-1.4.1 through TC-1.4.7 | ✅ Complete |
| Exit Application | TC-1.5.1 through TC-1.5.2 | ✅ Complete |
| Menu Validation | TC-3.1 through TC-3.3 | ✅ Complete |
| Amount Validation | TC-3.4 through TC-3.6 | ✅ Complete |
| Boundary Cases | TC-2.1 through TC-2.8 | ✅ Complete |
| Integration Workflows | TC-4.1 through TC-4.5 | ✅ Complete |

### Business Logic Coverage

| Business Logic | Positive Tests | Negative Tests | Edge Cases | Total |
|----------------|---------------|----------------|------------|-------|
| View Balance | 4 | 0 | 0 | 4 |
| Credit Account | 5 | 0 | 3 | 8 |
| Debit Account | 7 | 2 | 3 | 12 |
| Exit | 2 | 0 | 0 | 2 |
| Validation | 0 | 6 | 0 | 6 |
| Integration | 5 | 1 | 1 | 7 |
| **Total** | **23** | **9** | **7** | **39** |

---

## 7. Stakeholder Validation Checklist

### Business Logic Confirmation

- [ ] **Initial Balance**: Confirm starting balance of 1000.00 is correct
- [ ] **Overdraft Protection**: Confirm debit rejection when amount > balance
- [ ] **Zero Amounts**: Confirm zero credits/debits are acceptable behavior
- [ ] **Balance Limits**: Confirm maximum balance of 999,999.99 is acceptable
- [ ] **Decimal Precision**: Confirm 2 decimal places is sufficient
- [ ] **Menu Options**: Confirm 4 menu options cover all required functionality
- [ ] **Error Messages**: Review and approve all error messages
- [ ] **Exit Behavior**: Confirm exit behavior is acceptable

### Additional Requirements

- [ ] Are there any missing features that should be added?
- [ ] Are there any business rules not captured in this test plan?
- [ ] Should negative amounts be explicitly validated and rejected?
- [ ] Should there be minimum/maximum transaction limits?
- [ ] Should transaction history be maintained?
- [ ] Should balance be persisted to file/database?
- [ ] Should there be user authentication?
- [ ] Should there be audit logging?

### Approval Signatures

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Owner | | | |
| Product Manager | | | |
| QA Lead | | | |
| Development Lead | | | |

**Status**: ⏳ Awaiting Stakeholder Approval

---

## 8. Test Execution Guidelines

### Testing Environment
- **COBOL**: Compiled with GnuCOBOL, executable: `accountsystem`
- **Node.js**: Node.js v14+ with required dependencies installed

### Test Execution Order
1. **Phase 1**: Initial State Tests (TC-1.1.x)
2. **Phase 2**: Functional Tests (TC-1.2.x - TC-1.5.x)
3. **Phase 3**: Boundary Tests (TC-2.x)
4. **Phase 4**: Validation Tests (TC-3.x)
5. **Phase 5**: Integration Tests (TC-4.x)

### Pass/Fail Criteria
- **Pass**: Actual result matches expected result exactly
- **Fail**: Any deviation from expected result
- **Blocked**: Cannot execute due to environmental issues
- **Skipped**: Not applicable for current implementation

### Defect Reporting
When a test fails:
1. Document actual result in test case table
2. Mark status as "Fail"
3. Create detailed defect report with:
   - Test case ID
   - Steps to reproduce
   - Expected vs. actual results
   - Screenshots/logs if applicable
   - Severity and priority

---

## 9. Automation Readiness

### Unit Test Mapping (for Node.js)

#### data.js (Data Access Layer)
```javascript
describe('DataProgram', () => {
  // TC-1.1.1: Initial balance
  test('should initialize with balance 1000.00', ...)
  
  // TC-1.2.x: Read operations
  test('should read current balance', ...)
  
  // TC-1.3.x, TC-1.4.x: Write operations
  test('should update balance on write', ...)
})
```

#### operations.js (Business Logic Layer)
```javascript
describe('Operations', () => {
  // TC-1.3.x: Credit tests
  describe('credit', () => {
    test('should credit valid amount', ...) // TC-1.3.1
    test('should credit zero amount', ...) // TC-1.3.3
    test('should handle decimal amounts', ...) // TC-1.3.5
  })
  
  // TC-1.4.x: Debit tests
  describe('debit', () => {
    test('should debit valid amount', ...) // TC-1.4.1
    test('should reject insufficient funds', ...) // TC-1.4.5
    test('should debit exact balance', ...) // TC-1.4.4
  })
  
  // TC-2.x: Boundary tests
  describe('boundary cases', () => {
    test('should handle maximum balance', ...) // TC-2.1
    test('should prevent overflow', ...) // TC-2.3
  })
})
```

#### main.js (Presentation Layer)
```javascript
describe('MainProgram', () => {
  // TC-3.x: Input validation
  describe('menu validation', () => {
    test('should reject invalid menu choice', ...) // TC-3.1, TC-3.2
    test('should accept valid choices 1-4', ...)
  })
  
  // TC-1.5.x: Exit tests
  test('should exit gracefully', ...) // TC-1.5.1
})
```

#### Integration Tests
```javascript
describe('Account System Integration', () => {
  // TC-4.x: Workflow tests
  test('should handle complete user workflow', ...) // TC-4.1
  test('should maintain balance across operations', ...) // TC-4.5
  test('should handle sequential credits', ...) // TC-4.2
  test('should handle sequential debits', ...) // TC-4.3
})
```

### Test Framework Recommendations
- **JavaScript/Node.js**: Jest or Mocha + Chai
- **Code Coverage Tool**: Istanbul/nyc
- **Mocking**: Jest mocks or Sinon.js
- **Target Coverage**: 90%+ code coverage

---

## 10. Known Limitations and Assumptions

### Current Implementation Limitations
1. **No Data Persistence**: Balance resets to 1000.00 on application restart
2. **No Transaction History**: No audit trail of operations
3. **Single Account**: Only one account supported
4. **Session-Based**: Balance only persists during application session
5. **Limited Error Handling**: Non-numeric input may cause runtime errors
6. **No Concurrency**: Not designed for multi-user access

### Assumptions
1. Application runs on single-threaded environment
2. User inputs are provided via console/terminal
3. PIC 9(6)V99 format is sufficient for all monetary values
4. Starting balance of 1000.00 is fixed and not configurable
5. Two decimal places precision is sufficient
6. No requirement for currency symbols or formatting

### Future Enhancements (Out of Scope)
- Multi-account support
- User authentication
- Persistent storage (database/file)
- Transaction history and reporting
- Currency conversion
- Interest calculation
- Account types (savings, checking)
- Transfer between accounts

---

## 11. Traceability Matrix

| Requirement | COBOL Code Location | Test Case(s) | Status |
|-------------|-------------------|--------------|--------|
| Display menu with 4 options | main.cob lines 12-18 | TC-1.1.2 | ✅ |
| View balance operation | main.cob line 24, operations.cob lines 16-18 | TC-1.2.1-4 | ✅ |
| Credit account operation | main.cob line 26, operations.cob lines 20-26 | TC-1.3.1-5 | ✅ |
| Debit account operation | main.cob line 28, operations.cob lines 28-38 | TC-1.4.1-7 | ✅ |
| Exit application | main.cob line 30 | TC-1.5.1-2 | ✅ |
| Invalid menu choice handling | main.cob line 32 | TC-3.1-3 | ✅ |
| Insufficient funds validation | operations.cob line 32 | TC-1.4.5-6, TC-2.5 | ✅ |
| Initial balance = 1000.00 | data.cob line 6, operations.cob line 8 | TC-1.1.1 | ✅ |
| Read balance from storage | data.cob line 17 | TC-1.2.x | ✅ |
| Write balance to storage | data.cob line 20 | TC-1.3.x, TC-1.4.x | ✅ |

---

## 12. Test Execution Summary Template

### Test Run Information
- **Test Run ID**: _____________
- **Tester Name**: _____________
- **Date**: _____________
- **Environment**: [ ] COBOL  [ ] Node.js
- **Build/Version**: _____________

### Results Summary

| Category | Total | Passed | Failed | Blocked | Skipped | Pass % |
|----------|-------|--------|--------|---------|---------|--------|
| Initial State (TC-1.1.x) | 2 | | | | | |
| View Balance (TC-1.2.x) | 4 | | | | | |
| Credit Account (TC-1.3.x) | 5 | | | | | |
| Debit Account (TC-1.4.x) | 7 | | | | | |
| Exit (TC-1.5.x) | 2 | | | | | |
| Boundary (TC-2.x) | 8 | | | | | |
| Validation (TC-3.x) | 6 | | | | | |
| Integration (TC-4.x) | 5 | | | | | |
| **TOTAL** | **39** | | | | | |

### Defects Found
| Defect ID | Test Case | Severity | Description | Status |
|-----------|-----------|----------|-------------|--------|
| | | | | |

### Sign-off
- **Tester**: _________________ Date: _______
- **QA Lead**: _________________ Date: _______

---

## 13. Conversion Validation Strategy

### COBOL to Node.js Validation Approach

1. **Baseline Testing**: Execute all 39 test cases on COBOL application, document results
2. **Conversion**: Convert COBOL to Node.js (Issue #5)
3. **Regression Testing**: Execute same 39 test cases on Node.js application
4. **Comparison**: Compare results between COBOL and Node.js
5. **Acceptance**: Node.js must pass all tests that COBOL passes

### Success Criteria
✅ All test cases pass in Node.js with same results as COBOL  
✅ No regression in functionality  
✅ Business logic preserved exactly  
✅ Performance is acceptable (< 1 second per operation)  
✅ Code coverage > 90% in automated tests  
✅ Stakeholder approval obtained  

---

## Appendix A: Detailed Test Case Descriptions

### Test Case TC-1.1.1: Verify Initial Balance on Startup

**Description:** Verify that when the application starts for the first time, the initial balance is set to 1000.00.

**Pre-conditions:** 
- Application has not been started yet
- System environment is clean

**Test Steps:**
1. Launch the application
2. Select menu option 1 (View Balance)
3. Observe the displayed balance

**Expected Result:** 
The application should display: "Current balance: 1000.00"

**Business Rule:** BR-1 - Starting balance is always 1000.00

**Actual Result:** _To be filled during testing_

**Status:** _Pass/Fail to be determined_

**Comments:** This is the baseline test. All other tests depend on this being correct.

---

### Test Case TC-1.4.5: Debit with Insufficient Funds

**Description:** Verify that the system prevents a debit operation when the requested amount exceeds the current balance, implementing overdraft protection.

**Pre-conditions:**
- Application is running
- Current balance is 1000.00

**Test Steps:**
1. From the main menu, select option 3 (Debit Account)
2. When prompted, enter amount: 1500.00
3. Press Enter
4. Observe the displayed message
5. Select option 1 to verify balance remains unchanged

**Expected Result:**
- System displays: "Insufficient funds for this debit."
- Balance remains at 1000.00 (no change)
- User is returned to main menu

**Business Rule:** BR-2 - Balance cannot go negative (overdraft protection)

**Actual Result:** _To be filled during testing_

**Status:** _Pass/Fail to be determined_

**Comments:** Critical business rule - must be strictly enforced. This is the primary safeguard against overdrafts.

---

### Test Case TC-2.3: Credit Exceeding Maximum

**Description:** Verify system behavior when attempting to credit an amount that would exceed the maximum balance capacity (999,999.99).

**Pre-conditions:**
- Application is running
- Current balance is 999,990.00

**Test Steps:**
1. From main menu, select option 2 (Credit Account)
2. Enter amount: 20.00
3. Press Enter
4. Observe result

**Expected Result:**
Implementation-dependent behavior:
- Option A: Display error message and reject transaction
- Option B: Truncate to maximum value (999,999.99)
- Option C: Runtime error (data overflow)

**Business Rule:** BR-3 - Balance range: 0.00 to 999,999.99

**Actual Result:** _To be filled during testing_

**Status:** _Pass/Fail to be determined_

**Comments:** Document actual behavior for modernized version to replicate. This tests PIC 9(6)V99 overflow handling.

---

### Test Case TC-4.1: Complete User Workflow

**Description:** Verify that a complete sequence of operations (view, credit, debit, exit) maintains data consistency and correct balance throughout.

**Pre-conditions:**
- Application freshly started
- Initial balance: 1000.00

**Test Steps:**
1. Select option 1 (View Balance) - should show 1000.00
2. Select option 2 (Credit Account)
3. Enter amount: 500.00
4. Verify message shows new balance: 1500.00
5. Select option 1 (View Balance) - should show 1500.00
6. Select option 3 (Debit Account)
7. Enter amount: 300.00
8. Verify message shows new balance: 1200.00
9. Select option 1 (View Balance) - should show 1200.00
10. Select option 4 (Exit)
11. Verify exit message and application terminates

**Expected Result:**
- Step 1: Display "Current balance: 1000.00"
- Step 4: Display "Amount credited. New balance: 1500.00"
- Step 5: Display "Current balance: 1500.00"
- Step 8: Display "Amount debited. New balance: 1200.00"
- Step 9: Display "Current balance: 1200.00"
- Step 10: Display "Exiting the program. Goodbye!" and terminate

**Business Rules:** BR-6 (Read-Modify-Write), BR-7 (Balance persistence)

**Actual Result:** _To be filled during testing_

**Status:** _Pass/Fail to be determined_

**Comments:** This is the primary happy path integration test. All operations must maintain consistency.

---

## Appendix B: Test Data Sets

### Valid Test Amounts
```
0.00, 0.01, 0.99, 1.00, 10.00, 99.99, 100.00, 123.45, 999.99, 
1000.00, 5000.00, 10000.00, 50000.00, 99999.99, 100000.00, 
500000.00, 999999.99
```

### Invalid Test Amounts (if validation exists)
```
-1.00, -100.00, 1000000.00 (exceeds max), 
"abc", "12.3.4", "12.345" (3 decimals)
```

### Boundary Values
```
Minimum: 0.00
Maximum: 999,999.99
Precision boundary: 0.01 (smallest unit)
```

### Test Scenarios by Balance State

| Initial Balance | Credit Amount | Expected New Balance |
|----------------|---------------|---------------------|
| 0.00 | 100.00 | 100.00 |
| 1000.00 | 500.00 | 1500.00 |
| 999999.00 | 0.99 | 999999.99 |
| 500.00 | 0.00 | 500.00 |

| Initial Balance | Debit Amount | Expected Result | Expected New Balance |
|----------------|--------------|-----------------|---------------------|
| 1000.00 | 300.00 | Success | 700.00 |
| 1000.00 | 1000.00 | Success | 0.00 |
| 1000.00 | 1000.01 | Rejected | 1000.00 |
| 500.00 | 600.00 | Rejected | 500.00 |
| 0.00 | 0.01 | Rejected | 0.00 |

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Balance** | The current amount of money in the account, stored with 2 decimal precision |
| **Credit** | Adding money to the account (increases balance) |
| **Debit** | Removing money from the account (decreases balance) |
| **Overdraft** | Attempting to withdraw more money than available (not allowed) |
| **PIC 9(6)V99** | COBOL picture clause: 6 digits before decimal, 2 after (max: 999,999.99) |
| **Session** | The duration of a single application run (balance not persisted after exit) |
| **Working Storage** | COBOL memory area where data persists across program calls |
| **Read-Modify-Write** | Transaction pattern: read current value, modify it, write back |
| **STORAGE-BALANCE** | The persistent variable in data.cob that holds the account balance |

---

## Appendix D: References

### Related Documentation
- **COBOL_DOCUMENTATION.md** - Detailed code analysis and business logic
- **DIAGRAMS.md** - System architecture and data flow diagrams
- **MODERNIZATION_ROADMAP.md** - Overall project plan and workflow

### Source Code References
- **main.cob** - Presentation layer (menu and user interaction)
- **operations.cob** - Business logic layer (transaction processing)
- **data.cob** - Data access layer (balance storage)

### Standards and Guidelines
- COBOL 85 Standard (GnuCOBOL implementation)
- Two decimal place precision for monetary values
- Console-based user interface patterns

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-05 | Auto-generated | Initial test plan with basic test cases |
| 2.0 | 2025-11-06 | Test Plan Generator Agent | Enhanced with comprehensive test cases, validation tests, boundary tests, integration tests, coverage matrix, stakeholder validation section |

---

## Contact and Support

For questions about this test plan, contact:
- **QA Team Lead**: _____________
- **Product Owner**: _____________
- **Development Lead**: _____________

**Project Repository**: https://github.com/sukumarp2022/modernize-legacy-cobol-app

**Related Issues**:
- Issue #2: COBOL Business Logic Documentation
- Issue #3: Data Flow and Architecture Diagrams
- Issue #4: Test Plan Generation (this document)
- Issue #5: COBOL to Node.js Conversion
- Issue #6: Automated Test Implementation

---

**END OF TEST PLAN**

*This comprehensive test plan is ready for stakeholder validation and will be used to create automated unit and integration tests for the Node.js application.*

**Description:** Verify that the current balance is displayed correctly.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 1 to view the balance.

**Expected Result:** The application should display the current balance.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

### Test Case TC-2.1: Credit Account with Valid Amount

**Description:** Verify that the account is credited with a valid amount.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 2 to credit the account.
3. Enter a valid credit amount (e.g., 100.00).

**Expected Result:** The application should display the new balance after adding the credit amount.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

### Test Case TC-2.2: Credit Account with Zero Amount

**Description:** Verify that the account balance remains unchanged when credited with zero amount.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 2 to credit the account.
3. Enter 0.00 as the credit amount.

**Expected Result:** The application should display the same balance as before.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

### Test Case TC-3.1: Debit Account with Valid Amount

**Description:** Verify that the account is debited with a valid amount.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 3 to debit the account.
3. Enter a valid debit amount that is less than or equal to the current balance (e.g., 50.00).

**Expected Result:** The application should display the new balance after subtracting the debit amount.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

### Test Case TC-3.2: Debit Account with Amount Greater Than Balance

**Description:** Verify that the application prevents debiting an amount greater than the current balance.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 3 to debit the account.
3. Enter a debit amount that is greater than the current balance (e.g., 2000.00).

**Expected Result:** The application should display an "Insufficient funds" message and the balance should remain unchanged.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

### Test Case TC-3.3: Debit Account with Zero Amount

**Description:** Verify that the account balance remains unchanged when debited with zero amount.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 3 to debit the account.
3. Enter 0.00 as the debit amount.

**Expected Result:** The application should display the same balance as before.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

### Test Case TC-4.1: Exit the Application

**Description:** Verify that the application exits correctly.

**Pre-conditions:** Application started.

**Test Steps:**

1. Start the application.
2. Select option 4 to exit the application.

**Expected Result:** The application should display an exit message and terminate.

**Actual Result:** 

**Status (Pass/Fail):** 

**Comments:** 

---

## Summary

This test plan covers the main functionalities of the COBOL application, including viewing the balance, crediting the account, debiting the account, and exiting the application. Validate this test plan with the business stakeholders to ensure it meets the business requirements. Once validated, you can use this plan to create corresponding unit tests and integration tests for the Node.js application.

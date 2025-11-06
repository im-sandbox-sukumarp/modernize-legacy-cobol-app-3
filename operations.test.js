/**
 * Unit Tests for Operations Module (operations.js)
 * Tests the Business Logic Layer functionality
 * Covers test cases: TC-1.2.x, TC-1.3.x, TC-1.4.x, TC-2.x
 */

// Mock readline-sync before requiring operations
jest.mock('readline-sync');
const readlineSync = require('readline-sync');

// Mock data module
jest.mock('./data.js', () => {
  let mockBalance = 1000.00;
  return {
    readBalance: jest.fn(() => mockBalance),
    writeBalance: jest.fn((balance) => { mockBalance = balance; }),
    // Helper for tests to reset the mock balance
    __setMockBalance: (balance) => { mockBalance = balance; },
    __getMockBalance: () => mockBalance
  };
});

const dataProgram = require('./data.js');

describe('Operations - Business Logic Layer', () => {
  let operations;
  let consoleLogSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset mock balance to initial state
    dataProgram.__setMockBalance(1000.00);
    
    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Clear module cache and reload operations to get fresh instance
    jest.resetModules();
    jest.mock('readline-sync');
    jest.mock('./data.js', () => {
      let mockBalance = dataProgram.__getMockBalance();
      return {
        readBalance: jest.fn(() => mockBalance),
        writeBalance: jest.fn((balance) => { mockBalance = balance; }),
        __setMockBalance: (balance) => { mockBalance = balance; },
        __getMockBalance: () => mockBalance
      };
    });
    operations = require('./operations.js');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('View Balance Operations', () => {
    // TC-1.2.1: View Initial Balance
    test('TC-1.2.1: should display initial balance of 1000.00', () => {
      operations.viewBalance();
      
      expect(dataProgram.readBalance).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });

    // TC-1.2.2: View Balance After Credit
    test('TC-1.2.2: should display balance after credit', () => {
      dataProgram.__setMockBalance(1500.00);
      
      operations.viewBalance();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1500.00');
    });

    // TC-1.2.3: View Balance After Debit
    test('TC-1.2.3: should display balance after debit', () => {
      dataProgram.__setMockBalance(800.00);
      
      operations.viewBalance();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 800.00');
    });

    // TC-1.2.4: View Balance Multiple Times
    test('TC-1.2.4: should display same balance on multiple views', () => {
      operations.viewBalance();
      operations.viewBalance();
      operations.viewBalance();
      
      expect(dataProgram.readBalance).toHaveBeenCalledTimes(3);
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });

    test('should format balance with 2 decimal places', () => {
      dataProgram.__setMockBalance(1234.5);
      
      operations.viewBalance();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1234.50');
    });

    test('should handle zero balance', () => {
      dataProgram.__setMockBalance(0.00);
      
      operations.viewBalance();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 0.00');
    });
  });

  describe('Credit Account Operations', () => {
    // TC-1.3.1: Credit with Valid Amount
    test('TC-1.3.1: should credit valid amount 500.00', () => {
      readlineSync.question.mockReturnValue('500.00');
      
      operations.creditAccount();
      
      expect(dataProgram.readBalance).toHaveBeenCalled();
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1500.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
    });

    // TC-1.3.2: Credit with Small Amount
    test('TC-1.3.2: should credit small amount 0.01', () => {
      readlineSync.question.mockReturnValue('0.01');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.01);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1000.01');
    });

    // TC-1.3.3: Credit with Zero Amount
    test('TC-1.3.3: should credit zero amount (balance unchanged)', () => {
      readlineSync.question.mockReturnValue('0.00');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1000.00');
    });

    // TC-1.3.4: Credit with Large Amount
    test('TC-1.3.4: should credit large amount 50000.00', () => {
      readlineSync.question.mockReturnValue('50000.00');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(51000.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 51000.00');
    });

    // TC-1.3.5: Credit with Decimal Precision
    test('TC-1.3.5: should credit amount with decimal precision 123.45', () => {
      readlineSync.question.mockReturnValue('123.45');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1123.45);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1123.45');
    });

    test('should prompt for credit amount', () => {
      readlineSync.question.mockReturnValue('100.00');
      
      operations.creditAccount();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Enter credit amount: ');
    });

    test('should handle non-numeric input as zero', () => {
      readlineSync.question.mockReturnValue('abc');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.00);
    });

    test('should handle empty input as zero', () => {
      readlineSync.question.mockReturnValue('');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.00);
    });
  });

  describe('Debit Account Operations', () => {
    // TC-1.4.1: Debit with Valid Amount
    test('TC-1.4.1: should debit valid amount 300.00', () => {
      readlineSync.question.mockReturnValue('300.00');
      
      operations.debitAccount();
      
      expect(dataProgram.readBalance).toHaveBeenCalled();
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(700.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
    });

    // TC-1.4.2: Debit with Small Amount
    test('TC-1.4.2: should debit small amount 0.01', () => {
      readlineSync.question.mockReturnValue('0.01');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(999.99);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 999.99');
    });

    // TC-1.4.3: Debit with Zero Amount
    test('TC-1.4.3: should debit zero amount (balance unchanged)', () => {
      readlineSync.question.mockReturnValue('0.00');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 1000.00');
    });

    // TC-1.4.4: Debit Exact Balance Amount
    test('TC-1.4.4: should debit exact balance amount (balance becomes zero)', () => {
      readlineSync.question.mockReturnValue('1000.00');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(0.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
    });

    // TC-1.4.5: Debit with Insufficient Funds
    test('TC-1.4.5: should reject debit when amount exceeds balance', () => {
      readlineSync.question.mockReturnValue('1500.00');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });

    // TC-1.4.6: Debit from Zero Balance
    test('TC-1.4.6: should reject debit from zero balance', () => {
      dataProgram.__setMockBalance(0.00);
      readlineSync.question.mockReturnValue('50.00');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });

    // TC-1.4.7: Debit with Decimal Precision
    test('TC-1.4.7: should debit amount with decimal precision 234.56', () => {
      readlineSync.question.mockReturnValue('234.56');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(765.44);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 765.44');
    });

    test('should prompt for debit amount', () => {
      readlineSync.question.mockReturnValue('100.00');
      
      operations.debitAccount();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Enter debit amount: ');
    });

    test('should handle non-numeric input as zero', () => {
      readlineSync.question.mockReturnValue('xyz');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.00);
    });
  });

  describe('Boundary and Edge Cases', () => {
    // TC-2.1: Credit Maximum Valid Amount
    test('TC-2.1: should credit maximum valid amount to reach max balance', () => {
      dataProgram.__setMockBalance(0.00);
      readlineSync.question.mockReturnValue('999999.99');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(999999.99);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 999999.99');
    });

    // TC-2.2: Credit Near Maximum Balance
    test('TC-2.2: should credit near maximum balance', () => {
      dataProgram.__setMockBalance(999990.00);
      readlineSync.question.mockReturnValue('9.99');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(999999.99);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 999999.99');
    });

    // TC-2.4: Debit Just Below Balance
    test('TC-2.4: should debit just below balance leaving 0.01', () => {
      readlineSync.question.mockReturnValue('999.99');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(0.01);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 0.01');
    });

    // TC-2.5: Debit One Cent Over Balance
    test('TC-2.5: should reject debit one cent over balance', () => {
      readlineSync.question.mockReturnValue('1000.01');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });

    test('should handle very small balance correctly', () => {
      dataProgram.__setMockBalance(0.01);
      readlineSync.question.mockReturnValue('0.01');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(0.00);
    });

    test('should handle large credit amount', () => {
      readlineSync.question.mockReturnValue('500000.00');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(501000.00);
    });
  });

  describe('Process Operation Routing', () => {
    test('should route TOTAL to viewBalance', () => {
      const viewBalanceSpy = jest.spyOn(operations, 'viewBalance');
      
      operations.processOperation('TOTAL');
      
      expect(viewBalanceSpy).toHaveBeenCalled();
    });

    test('should route CREDIT to creditAccount', () => {
      readlineSync.question.mockReturnValue('100.00');
      const creditAccountSpy = jest.spyOn(operations, 'creditAccount');
      
      operations.processOperation('CREDIT');
      
      expect(creditAccountSpy).toHaveBeenCalled();
    });

    test('should route DEBIT to debitAccount', () => {
      readlineSync.question.mockReturnValue('100.00');
      const debitAccountSpy = jest.spyOn(operations, 'debitAccount');
      
      operations.processOperation('DEBIT');
      
      expect(debitAccountSpy).toHaveBeenCalled();
    });

    test('should handle operation types case-insensitively', () => {
      const viewBalanceSpy = jest.spyOn(operations, 'viewBalance');
      
      operations.processOperation('total');
      operations.processOperation('TOTAL');
      operations.processOperation('Total');
      
      expect(viewBalanceSpy).toHaveBeenCalledTimes(3);
    });

    test('should handle operation types with whitespace', () => {
      const viewBalanceSpy = jest.spyOn(operations, 'viewBalance');
      
      operations.processOperation('TOTAL ');
      operations.processOperation(' TOTAL');
      
      expect(viewBalanceSpy).toHaveBeenCalledTimes(2);
    });

    test('should handle invalid operation type gracefully', () => {
      expect(() => operations.processOperation('INVALID')).not.toThrow();
    });
  });

  describe('Decimal Precision Tests', () => {
    test('should maintain precision in credit operations', () => {
      readlineSync.question.mockReturnValue('0.99');
      
      operations.creditAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(1000.99);
    });

    test('should maintain precision in debit operations', () => {
      readlineSync.question.mockReturnValue('0.99');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(999.01);
    });

    test('should handle floating point arithmetic correctly', () => {
      dataProgram.__setMockBalance(100.10);
      readlineSync.question.mockReturnValue('50.05');
      
      operations.debitAccount();
      
      expect(dataProgram.writeBalance).toHaveBeenCalledWith(50.05);
    });
  });
});

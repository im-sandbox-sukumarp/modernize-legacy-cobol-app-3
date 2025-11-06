/**
 * Integration Tests for Account Management System
 * Tests complete workflows across all modules
 * Covers test cases: TC-4.x (Integration and Workflow Tests)
 */

const DataProgram = require('./data.js');

// For integration tests, we need to test actual module interactions
// So we'll use real modules but mock only the user input

describe('Account Management System - Integration Tests', () => {
  let dataProgram;
  let operations;
  let readlineSync;
  let consoleLogSpy;

  beforeEach(() => {
    // Clear module cache to get fresh instances
    jest.resetModules();
    
    // Mock readline-sync
    jest.mock('readline-sync');
    readlineSync = require('readline-sync');
    
    // Get fresh instances of modules
    dataProgram = require('./data.js');
    operations = require('./operations.js');
    
    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Complete User Workflow Tests', () => {
    // TC-4.1: Complete User Workflow
    test('TC-4.1: should handle complete user workflow correctly', () => {
      // Step 1: View balance (should show 1000.00)
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
      
      // Step 2-3: Credit account with 500.00
      readlineSync.question.mockReturnValueOnce('500.00');
      operations.creditAccount();
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
      
      // Step 4: View balance (should show 1500.00)
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1500.00');
      
      // Step 5-6: Debit account with 300.00
      readlineSync.question.mockReturnValueOnce('300.00');
      operations.debitAccount();
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 1200.00');
      
      // Step 7: View balance (should show 1200.00)
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1200.00');
      
      // Verify final state
      const finalBalance = dataProgram.readBalance();
      expect(finalBalance).toBe(1200.00);
    });

    test('should maintain consistency across view operations', () => {
      // View multiple times - should show same balance
      operations.viewBalance();
      operations.viewBalance();
      operations.viewBalance();
      
      const balance = dataProgram.readBalance();
      expect(balance).toBe(1000.00);
    });
  });

  describe('Sequential Operations Tests', () => {
    // TC-4.2: Sequential Credits
    test('TC-4.2: should handle sequential credits correctly', () => {
      // Credit 100.00 (balance: 1100.00)
      readlineSync.question.mockReturnValueOnce('100.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1100.00);
      
      // Credit 200.00 (balance: 1300.00)
      readlineSync.question.mockReturnValueOnce('200.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1300.00);
      
      // Credit 50.00 (balance: 1350.00)
      readlineSync.question.mockReturnValueOnce('50.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1350.00);
      
      // Verify final balance
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1350.00');
    });

    // TC-4.3: Sequential Debits
    test('TC-4.3: should handle sequential debits correctly', () => {
      // Debit 100.00 (balance: 900.00)
      readlineSync.question.mockReturnValueOnce('100.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(900.00);
      
      // Debit 200.00 (balance: 700.00)
      readlineSync.question.mockReturnValueOnce('200.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(700.00);
      
      // Debit 50.00 (balance: 650.00)
      readlineSync.question.mockReturnValueOnce('50.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(650.00);
      
      // Verify final balance
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 650.00');
    });

    test('should handle alternating credits and debits', () => {
      // Credit 100.00
      readlineSync.question.mockReturnValueOnce('100.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1100.00);
      
      // Debit 50.00
      readlineSync.question.mockReturnValueOnce('50.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(1050.00);
      
      // Credit 25.00
      readlineSync.question.mockReturnValueOnce('25.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1075.00);
      
      // Debit 75.00
      readlineSync.question.mockReturnValueOnce('75.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(1000.00);
    });
  });

  describe('Error Recovery Tests', () => {
    // TC-4.4: Failed Debit Followed by Success
    test('TC-4.4: should handle failed debit followed by successful debit', () => {
      // Set balance to 500.00
      dataProgram.writeBalance(500.00);
      
      // Step 1: Attempt to debit 600.00 (should be rejected)
      readlineSync.question.mockReturnValueOnce('600.00');
      operations.debitAccount();
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
      
      // Step 2: View balance (should still be 500.00)
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 500.00');
      expect(dataProgram.readBalance()).toBe(500.00);
      
      // Step 3: Debit 400.00 (should succeed, balance: 100.00)
      readlineSync.question.mockReturnValueOnce('400.00');
      operations.debitAccount();
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 100.00');
      expect(dataProgram.readBalance()).toBe(100.00);
    });

    test('should handle multiple failed debits without affecting balance', () => {
      readlineSync.question
        .mockReturnValueOnce('1500.00')
        .mockReturnValueOnce('2000.00')
        .mockReturnValueOnce('1100.00');
      
      // Three failed attempts
      operations.debitAccount();
      operations.debitAccount();
      operations.debitAccount();
      
      // Balance should remain 1000.00
      expect(dataProgram.readBalance()).toBe(1000.00);
    });

    test('should handle zero amount operations without side effects', () => {
      // Credit zero
      readlineSync.question.mockReturnValueOnce('0.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1000.00);
      
      // Debit zero
      readlineSync.question.mockReturnValueOnce('0.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(1000.00);
      
      // Balance unchanged
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });
  });

  describe('Balance Persistence Tests', () => {
    // TC-4.5: Balance Persistence Across Operations
    test('TC-4.5: should maintain balance across multiple operations', () => {
      // Credit 500.00
      readlineSync.question.mockReturnValueOnce('500.00');
      operations.creditAccount();
      
      // Return to menu (simulated by just viewing balance)
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1500.00');
      
      // Debit 200.00
      readlineSync.question.mockReturnValueOnce('200.00');
      operations.debitAccount();
      
      // Return to menu and view balance
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1300.00');
      
      // Final verification
      expect(dataProgram.readBalance()).toBe(1300.00);
    });

    test('should persist balance through many operations', () => {
      // Perform 10 small credits
      for (let i = 0; i < 10; i++) {
        readlineSync.question.mockReturnValueOnce('10.00');
        operations.creditAccount();
      }
      
      expect(dataProgram.readBalance()).toBe(1100.00);
      
      // Perform 5 small debits
      for (let i = 0; i < 5; i++) {
        readlineSync.question.mockReturnValueOnce('20.00');
        operations.debitAccount();
      }
      
      expect(dataProgram.readBalance()).toBe(1000.00);
    });

    test('should maintain state through read operations', () => {
      readlineSync.question.mockReturnValueOnce('250.00');
      operations.creditAccount();
      
      // Multiple reads shouldn't affect state
      operations.viewBalance();
      operations.viewBalance();
      operations.viewBalance();
      
      expect(dataProgram.readBalance()).toBe(1250.00);
    });
  });

  describe('Boundary Integration Tests', () => {
    test('should handle reaching zero balance through sequential operations', () => {
      // Debit in steps to zero
      readlineSync.question.mockReturnValueOnce('500.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(500.00);
      
      readlineSync.question.mockReturnValueOnce('300.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(200.00);
      
      readlineSync.question.mockReturnValueOnce('200.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(0.00);
      
      // Verify zero balance
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 0.00');
    });

    test('should handle building up from zero balance', () => {
      // Set to zero
      dataProgram.writeBalance(0.00);
      
      // Build up with credits
      readlineSync.question.mockReturnValueOnce('100.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(100.00);
      
      readlineSync.question.mockReturnValueOnce('250.50');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(350.50);
      
      readlineSync.question.mockReturnValueOnce('149.50');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(500.00);
    });

    test('should handle large balance accumulation', () => {
      // Credit large amounts
      readlineSync.question.mockReturnValueOnce('50000.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(51000.00);
      
      readlineSync.question.mockReturnValueOnce('100000.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(151000.00);
      
      // Debit back down
      readlineSync.question.mockReturnValueOnce('150000.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(1000.00);
    });
  });

  describe('Decimal Precision Integration Tests', () => {
    test('should maintain precision through multiple operations', () => {
      // Credit with decimals
      readlineSync.question.mockReturnValueOnce('123.45');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1123.45);
      
      // Debit with decimals
      readlineSync.question.mockReturnValueOnce('23.45');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(1100.00);
      
      // View should show correct precision
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1100.00');
    });

    test('should handle accumulation of small decimal amounts', () => {
      // Add 0.01 ten times
      for (let i = 0; i < 10; i++) {
        readlineSync.question.mockReturnValueOnce('0.01');
        operations.creditAccount();
      }
      
      expect(dataProgram.readBalance()).toBe(1000.10);
    });

    test('should handle complex decimal arithmetic', () => {
      readlineSync.question.mockReturnValueOnce('99.99');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(1099.99);
      
      readlineSync.question.mockReturnValueOnce('99.99');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(1000.00);
    });
  });

  describe('Operation Routing Integration', () => {
    test('should route TOTAL operation correctly', () => {
      operations.processOperation('TOTAL');
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });

    test('should route CREDIT operation correctly', () => {
      readlineSync.question.mockReturnValueOnce('500.00');
      operations.processOperation('CREDIT');
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
    });

    test('should route DEBIT operation correctly', () => {
      readlineSync.question.mockReturnValueOnce('300.00');
      operations.processOperation('DEBIT');
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
    });

    test('should handle mixed operation types in sequence', () => {
      operations.processOperation('TOTAL');
      expect(dataProgram.readBalance()).toBe(1000.00);
      
      readlineSync.question.mockReturnValueOnce('200.00');
      operations.processOperation('CREDIT');
      expect(dataProgram.readBalance()).toBe(1200.00);
      
      operations.processOperation('TOTAL');
      expect(dataProgram.readBalance()).toBe(1200.00);
      
      readlineSync.question.mockReturnValueOnce('100.00');
      operations.processOperation('DEBIT');
      expect(dataProgram.readBalance()).toBe(1100.00);
    });
  });

  describe('Stress Tests', () => {
    test('should handle many sequential operations', () => {
      let expectedBalance = 1000.00;
      
      // 50 operations
      for (let i = 0; i < 25; i++) {
        readlineSync.question.mockReturnValueOnce('10.00');
        operations.creditAccount();
        expectedBalance += 10.00;
      }
      
      for (let i = 0; i < 25; i++) {
        readlineSync.question.mockReturnValueOnce('10.00');
        operations.debitAccount();
        expectedBalance -= 10.00;
      }
      
      expect(dataProgram.readBalance()).toBe(expectedBalance);
      expect(dataProgram.readBalance()).toBe(1000.00);
    });

    test('should handle rapid balance changes', () => {
      readlineSync.question.mockReturnValueOnce('900.00');
      operations.debitAccount();
      
      readlineSync.question.mockReturnValueOnce('900.00');
      operations.creditAccount();
      
      readlineSync.question.mockReturnValueOnce('1000.00');
      operations.creditAccount();
      
      readlineSync.question.mockReturnValueOnce('1000.00');
      operations.debitAccount();
      
      expect(dataProgram.readBalance()).toBe(1000.00);
    });
  });

  describe('Business Rule Validation', () => {
    test('should enforce overdraft protection across operations', () => {
      // Debit most of balance
      readlineSync.question.mockReturnValueOnce('900.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(100.00);
      
      // Try to debit more than remaining
      readlineSync.question.mockReturnValueOnce('200.00');
      operations.debitAccount();
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
      expect(dataProgram.readBalance()).toBe(100.00);
      
      // Should be able to debit exact amount
      readlineSync.question.mockReturnValueOnce('100.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(0.00);
    });

    test('should allow zero balance operations', () => {
      // Reduce to zero
      readlineSync.question.mockReturnValueOnce('1000.00');
      operations.debitAccount();
      expect(dataProgram.readBalance()).toBe(0.00);
      
      // Can view zero balance
      operations.viewBalance();
      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 0.00');
      
      // Can credit from zero
      readlineSync.question.mockReturnValueOnce('500.00');
      operations.creditAccount();
      expect(dataProgram.readBalance()).toBe(500.00);
      
      // Cannot debit from zero
      dataProgram.writeBalance(0.00);
      readlineSync.question.mockReturnValueOnce('1.00');
      operations.debitAccount();
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });
  });
});

/**
 * Unit Tests for Data Module (data.js)
 * Tests the Data Access Layer functionality
 * Covers test cases: TC-1.1.1, TC-1.2.x read operations
 */

const DataProgram = require('./data.js');

describe('DataProgram - Data Access Layer', () => {
  let dataInstance;

  beforeEach(() => {
    // Create a fresh instance for each test to ensure isolation
    const DataProgramClass = require('./data.js').constructor;
    dataInstance = new DataProgramClass();
  });

  describe('Initial State Tests', () => {
    // TC-1.1.1: Verify Initial Balance on Startup
    test('TC-1.1.1: should initialize with balance 1000.00', () => {
      const balance = dataInstance.readBalance();
      expect(balance).toBe(1000.00);
    });

    test('should have storageBalance property set to 1000.00', () => {
      expect(dataInstance.storageBalance).toBe(1000.00);
    });
  });

  describe('Read Operations', () => {
    // TC-1.2.x: View Balance Tests
    test('TC-1.2.1: should read initial balance correctly', () => {
      const balance = dataInstance.readBalance();
      expect(balance).toBe(1000.00);
    });

    test('should read balance multiple times consistently', () => {
      const balance1 = dataInstance.readBalance();
      const balance2 = dataInstance.readBalance();
      const balance3 = dataInstance.readBalance();
      
      expect(balance1).toBe(1000.00);
      expect(balance2).toBe(1000.00);
      expect(balance3).toBe(1000.00);
    });

    test('should use handleOperation with READ operation', () => {
      const balance = dataInstance.handleOperation('READ');
      expect(balance).toBe(1000.00);
    });

    test('should handle READ operation case-insensitively', () => {
      const balance1 = dataInstance.handleOperation('read');
      const balance2 = dataInstance.handleOperation('READ');
      const balance3 = dataInstance.handleOperation('ReAd');
      
      expect(balance1).toBe(balance2);
      expect(balance2).toBe(balance3);
    });

    test('should handle READ operation with whitespace', () => {
      const balance = dataInstance.handleOperation('READ  ');
      expect(balance).toBe(1000.00);
    });
  });

  describe('Write Operations', () => {
    test('should write new balance correctly', () => {
      dataInstance.writeBalance(1500.00);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(1500.00);
    });

    test('should update balance to zero', () => {
      dataInstance.writeBalance(0.00);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(0.00);
    });

    test('should update balance to maximum value', () => {
      dataInstance.writeBalance(999999.99);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(999999.99);
    });

    test('should handle decimal precision', () => {
      dataInstance.writeBalance(1234.56);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(1234.56);
    });

    test('should use handleOperation with WRITE operation', () => {
      dataInstance.handleOperation('WRITE', 2000.00);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(2000.00);
    });

    test('should handle WRITE operation case-insensitively', () => {
      dataInstance.handleOperation('write', 3000.00);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(3000.00);
    });

    test('should handle WRITE operation with whitespace', () => {
      dataInstance.handleOperation('WRITE ', 4000.00);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(4000.00);
    });
  });

  describe('Balance Persistence', () => {
    // TC-4.5: Balance Persistence Across Operations
    test('TC-4.5: should persist balance across multiple read operations', () => {
      dataInstance.writeBalance(1500.00);
      
      const balance1 = dataInstance.readBalance();
      const balance2 = dataInstance.readBalance();
      const balance3 = dataInstance.readBalance();
      
      expect(balance1).toBe(1500.00);
      expect(balance2).toBe(1500.00);
      expect(balance3).toBe(1500.00);
    });

    test('should persist balance across multiple write operations', () => {
      dataInstance.writeBalance(1000.00);
      dataInstance.writeBalance(1500.00);
      dataInstance.writeBalance(2000.00);
      
      const balance = dataInstance.readBalance();
      expect(balance).toBe(2000.00);
    });

    test('should maintain state through read-write-read sequence', () => {
      const initial = dataInstance.readBalance();
      expect(initial).toBe(1000.00);
      
      dataInstance.writeBalance(1234.56);
      
      const updated = dataInstance.readBalance();
      expect(updated).toBe(1234.56);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small amounts (0.01)', () => {
      dataInstance.writeBalance(0.01);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(0.01);
    });

    test('should handle large amounts near maximum', () => {
      dataInstance.writeBalance(999999.99);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(999999.99);
    });

    test('should handle sequential small increments', () => {
      dataInstance.writeBalance(1000.00);
      dataInstance.writeBalance(1000.01);
      dataInstance.writeBalance(1000.02);
      
      const balance = dataInstance.readBalance();
      expect(balance).toBe(1000.02);
    });

    test('should return current balance for unknown operation type', () => {
      const balance = dataInstance.handleOperation('INVALID');
      expect(balance).toBe(1000.00);
    });

    test('should handle WRITE without balance parameter', () => {
      const initialBalance = dataInstance.readBalance();
      dataInstance.handleOperation('WRITE', null);
      const finalBalance = dataInstance.readBalance();
      expect(finalBalance).toBe(initialBalance);
    });
  });

  describe('Data Type Tests', () => {
    test('should return number type for balance', () => {
      const balance = dataInstance.readBalance();
      expect(typeof balance).toBe('number');
    });

    test('should handle balance as floating point', () => {
      dataInstance.writeBalance(1234.567); // More than 2 decimals
      const balance = dataInstance.readBalance();
      expect(balance).toBe(1234.567);
    });

    test('should handle integer as balance', () => {
      dataInstance.writeBalance(5000);
      const balance = dataInstance.readBalance();
      expect(balance).toBe(5000);
    });
  });
});

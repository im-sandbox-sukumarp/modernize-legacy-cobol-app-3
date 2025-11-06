/**
 * Unit Tests for Main Module (main.js)
 * Tests the Presentation Layer functionality
 * Covers test cases: TC-1.1.2, TC-1.5.x, TC-3.x
 */

// Mock readline-sync
jest.mock('readline-sync');
const readlineSync = require('readline-sync');

// Mock operations module
jest.mock('./operations.js', () => ({
  processOperation: jest.fn()
}));

const operations = require('./operations.js');
const MainProgram = require('./main.js');

describe('MainProgram - Presentation Layer', () => {
  let consoleLogSpy;
  let processExitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('Menu Display Tests', () => {
    // TC-1.1.2: Verify Menu Display on Startup
    test('TC-1.1.2: should display menu with 4 options', () => {
      readlineSync.question.mockReturnValueOnce('4'); // Exit immediately
      
      const app = new MainProgram();
      app.run();
      
      // Verify menu components are displayed
      expect(consoleLogSpy).toHaveBeenCalledWith('--------------------------------');
      expect(consoleLogSpy).toHaveBeenCalledWith('Account Management System');
      expect(consoleLogSpy).toHaveBeenCalledWith('1. View Balance');
      expect(consoleLogSpy).toHaveBeenCalledWith('2. Credit Account');
      expect(consoleLogSpy).toHaveBeenCalledWith('3. Debit Account');
      expect(consoleLogSpy).toHaveBeenCalledWith('4. Exit');
      expect(consoleLogSpy).toHaveBeenCalledWith('Enter your choice (1-4): ');
    });

    test('should display menu in correct order', () => {
      readlineSync.question.mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      const calls = consoleLogSpy.mock.calls.map(call => call[0]);
      const menuStartIndex = calls.indexOf('Account Management System');
      
      expect(calls[menuStartIndex + 1]).toBe('1. View Balance');
      expect(calls[menuStartIndex + 2]).toBe('2. Credit Account');
      expect(calls[menuStartIndex + 3]).toBe('3. Debit Account');
      expect(calls[menuStartIndex + 4]).toBe('4. Exit');
    });
  });

  describe('Menu Choice Processing', () => {
    test('should process choice 1 (View Balance)', () => {
      readlineSync.question
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledWith('TOTAL');
    });

    test('should process choice 2 (Credit Account)', () => {
      readlineSync.question
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledWith('CREDIT');
    });

    test('should process choice 3 (Debit Account)', () => {
      readlineSync.question
        .mockReturnValueOnce('3')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledWith('DEBIT');
    });

    test('should handle multiple operations before exit', () => {
      readlineSync.question
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('3')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledTimes(3);
      expect(operations.processOperation).toHaveBeenNthCalledWith(1, 'TOTAL');
      expect(operations.processOperation).toHaveBeenNthCalledWith(2, 'CREDIT');
      expect(operations.processOperation).toHaveBeenNthCalledWith(3, 'DEBIT');
    });
  });

  describe('Exit Functionality', () => {
    // TC-1.5.1: Exit from Main Menu
    test('TC-1.5.1: should exit gracefully when option 4 is selected', () => {
      readlineSync.question.mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    // TC-1.5.2: Exit After Transactions
    test('TC-1.5.2: should exit after performing transactions', () => {
      readlineSync.question
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    test('should set continueFlag to NO on exit', () => {
      readlineSync.question.mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(app.continueFlag).toBe('NO');
    });

    test('should terminate with exit code 0', () => {
      readlineSync.question.mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('Input Validation Tests', () => {
    // TC-3.1: Invalid Menu Choice - Zero
    test('TC-3.1: should reject menu choice 0', () => {
      readlineSync.question
        .mockReturnValueOnce('0')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
      expect(operations.processOperation).not.toHaveBeenCalled();
    });

    // TC-3.2: Invalid Menu Choice - High Number
    test('TC-3.2: should reject menu choice 5', () => {
      readlineSync.question
        .mockReturnValueOnce('5')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
      expect(operations.processOperation).not.toHaveBeenCalled();
    });

    test('should reject negative menu choice', () => {
      readlineSync.question
        .mockReturnValueOnce('-1')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should reject menu choice 10', () => {
      readlineSync.question
        .mockReturnValueOnce('10')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    // TC-3.3: Invalid Menu Choice - Letter
    test('TC-3.3: should handle non-numeric input (letter)', () => {
      readlineSync.question
        .mockReturnValueOnce('A')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should handle non-numeric input (word)', () => {
      readlineSync.question
        .mockReturnValueOnce('exit')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should handle empty input', () => {
      readlineSync.question
        .mockReturnValueOnce('')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should handle special characters', () => {
      readlineSync.question
        .mockReturnValueOnce('@#$')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should redisplay menu after invalid choice', () => {
      readlineSync.question
        .mockReturnValueOnce('9')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      // Menu should be displayed at least twice (initial + after invalid)
      const menuCalls = consoleLogSpy.mock.calls.filter(
        call => call[0] === 'Account Management System'
      );
      expect(menuCalls.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Initialization Tests', () => {
    test('should initialize with continueFlag as YES', () => {
      const app = new MainProgram();
      expect(app.continueFlag).toBe('YES');
    });

    test('should create MainProgram instance successfully', () => {
      const app = new MainProgram();
      expect(app).toBeInstanceOf(MainProgram);
      expect(app.run).toBeDefined();
    });
  });

  describe('Loop Behavior Tests', () => {
    test('should continue looping until exit is selected', () => {
      readlineSync.question
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('3')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      // Should display menu 5 times (once for each choice)
      const menuCalls = consoleLogSpy.mock.calls.filter(
        call => call[0] === 'Account Management System'
      );
      expect(menuCalls.length).toBe(5);
    });

    test('should handle immediate exit', () => {
      readlineSync.question.mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!');
    });

    test('should process multiple invalid choices before valid exit', () => {
      readlineSync.question
        .mockReturnValueOnce('0')
        .mockReturnValueOnce('5')
        .mockReturnValueOnce('abc')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      const invalidCalls = consoleLogSpy.mock.calls.filter(
        call => call[0] === 'Invalid choice, please select 1-4.'
      );
      expect(invalidCalls.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('should handle decimal input as invalid', () => {
      readlineSync.question
        .mockReturnValueOnce('2.5')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should handle whitespace input', () => {
      readlineSync.question
        .mockReturnValueOnce('   ')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    });

    test('should handle valid choice with leading/trailing spaces', () => {
      readlineSync.question
        .mockReturnValueOnce(' 1 ')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledWith('TOTAL');
    });
  });

  describe('User Choice Parsing', () => {
    test('should parse string numbers correctly', () => {
      readlineSync.question
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('3')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      expect(operations.processOperation).toHaveBeenCalledTimes(3);
    });

    test('should handle parseInt conversion', () => {
      readlineSync.question
        .mockReturnValueOnce('1.9')
        .mockReturnValueOnce('4');
      
      const app = new MainProgram();
      app.run();
      
      // parseInt('1.9') = 1, which is valid
      expect(operations.processOperation).toHaveBeenCalledWith('TOTAL');
    });
  });
});

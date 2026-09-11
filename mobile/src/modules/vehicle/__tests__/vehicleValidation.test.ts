import {
  formatVehicleRegistrationInput,
  validateRequiredText,
  validateVehicleRegistration,
} from '../vehicleValidation';

describe('vehicle registration validation', () => {
  test('normalizes case and removes separators', () => {
    expect(formatVehicleRegistrationInput('jh-01 ab 1234')).toBe('JH01AB1234');
  });

  test('accepts a normalized registration within the supported range', () => {
    expect(validateVehicleRegistration('JH01AB1234')).toEqual({
      ok: true,
      normalizedRegistration: 'JH01AB1234',
    });
  });

  test('rejects registrations that are too short', () => {
    expect(validateVehicleRegistration('A12')).toEqual({
      ok: false,
      message: 'Registration number must contain 4–15 letters/numbers.',
    });
  });
});

describe('required vehicle text validation', () => {
  test('rejects blank text', () => {
    expect(validateRequiredText('  ', 'Vehicle name', 40)).toBe(
      'Vehicle name is required.',
    );
  });

  test('rejects text above the maximum length', () => {
    expect(validateRequiredText('12345', 'Vehicle type', 4)).toBe(
      'Vehicle type must be 4 characters or fewer.',
    );
  });
});

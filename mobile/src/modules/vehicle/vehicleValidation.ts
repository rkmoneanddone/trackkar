export type VehicleValidationResult =
  | {ok: true; normalizedRegistration: string}
  | {ok: false; message: string};

export function normalizeVehicleRegistration(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10);
}

export function formatVehicleRegistrationInput(value: string) {
  return normalizeVehicleRegistration(value);
}

export function validateVehicleRegistration(
  value: string,
): VehicleValidationResult {
  const normalizedRegistration = normalizeVehicleRegistration(value);

  if (normalizedRegistration.length !== 10) {
    return {
      ok: false,
      message: 'Registration number must contain exactly 10 letters/numbers.',
    };
  }

  if (!/^[A-Z0-9]{10}$/.test(normalizedRegistration)) {
    return {
      ok: false,
      message: 'Use only letters and numbers in the registration number.',
    };
  }

  return {ok: true, normalizedRegistration};
}

export function validateRequiredText(
  value: string,
  label: string,
  maxLength: number,
) {
  const clean = value.trim();

  if (!clean) {
    return `${label} is required.`;
  }

  if (clean.length > maxLength) {
    return `${label} must be ${maxLength} characters or fewer.`;
  }

  return null;
}
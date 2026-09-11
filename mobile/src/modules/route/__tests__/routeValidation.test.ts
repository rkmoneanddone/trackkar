import {validateRouteDirection, validateRouteName} from '../routeValidation';

describe('route validation', () => {
  test('requires a route name', () => expect(validateRouteName('  ')).toBe('Route name is required.'));
  test('accepts a useful route name', () => expect(validateRouteName('Booty More to Manan Vidya')).toBeNull());
  test('accepts only supported directions', () => {
    expect(validateRouteDirection('OUTBOUND')).toBe(true);
    expect(validateRouteDirection('RETURN')).toBe(true);
    expect(validateRouteDirection('SIDEWAYS')).toBe(false);
  });
});

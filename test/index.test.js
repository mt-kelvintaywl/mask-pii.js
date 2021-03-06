const { string, domain, email } = require('..');

describe('Mask PII', () => {
  test('string', () => {
    expect(string('')).toEqual('********');
    expect(string('a')).toEqual('a********');
    expect(string('Hello world')).toEqual('H********d');
    expect(string('Hello world', '★')).toEqual('H★★★★★★★★d');
    expect(string('Hello world', '#')).toEqual('H########d');
    expect(string('Hello world', '##')).toEqual('H################d');

    // test bad input

    const notStrings = [
      undefined,
      null,
      1,
      true,
      {},
      [],
      () => {},
      /a/
    ];

    for (const input of notStrings) {
      expect(() => {
        string(input);        // bad subject
      }).toThrow(new TypeError('Subject is not a string'));

      expect(() => {
        domain(input);        // bad subject
      }).toThrow(new TypeError('Subject is not a string'));

      expect(() => {
        email(input);        // bad subject
      }).toThrow(new TypeError('Subject is not a string'));

      // undefined will revert the mask to its default value, so don't test it
      if (input === undefined) {
        continue;
      }

      expect(() => {
        string('abc', input); // bad mask
      }).toThrow(new TypeError('Mask is not a string'));
    }
  });

  test('domain', () => {
    expect(domain('foo')).toEqual('f********o');
    expect(domain('foo.')).toEqual('f********.');
    expect(domain('.foo')).toEqual('.********o');
    expect(domain('foo.com')).toEqual('f********o.com');
    expect(domain('foo.bar.com')).toEqual('f********r.com');
    expect(domain('foo.com', '#')).toEqual('f########o.com');
  });

  test('email', () => {
    expect(email('foo')).toEqual('f********o');
    expect(email('foo.com')).toEqual('f********m');
    expect(email('bob@foo.com')).toEqual('b********b@f********o.com');
    expect(email('bob@foo.com', '#')).toEqual('b########b@f########o.com');
  });
});

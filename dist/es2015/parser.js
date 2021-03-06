
export let Parser = class Parser {
  static parse(content) {
    let parser = new Parser();
    parser.doParse(content);
    return parser.getEnv();
  }

  constructor() {
    this.env = {};
    this.lineNum = 0;
  }

  doParse(content) {
    let lines = this.getLines(content);
    return this.parseContent(lines);
  }

  getLines(content) {
    return content.split('\n');
  }

  parseContent(lines) {
    this.env = {};
    this.lineNum = 0;
    for (let line of lines) {
      this.lineNum++;
      if (line.startsWith('#') || !line) {
        continue;
      }

      this.parseLine(line);
    }

    return this.env;
  }

  parseLine(line) {
    let pair = this.parseKeyValuePair(line);

    this.env[pair.key] = pair.value;
  }

  parseKeyValuePair(line) {
    let pair = line.split('=');

    if (pair.length !== 2) {
      throw new Error('Could not parse key value pair from line "' + line + '"');
    }

    let key = pair[0].trim();
    let value = this.stripComments(pair[1]);

    return {
      key: key,
      value: value
    };
  }

  stripComments(value) {
    let values = value.split(' #');
    return values[0].trim();
  }

  getEnv() {
    return this.env;
  }
};
import fs from 'fs';
import Parser from '../Parser.js'

const binData = fs.readFileSync('./spec/assets/dns_response.binary');

describe("Parser", () => {
    let parser;
    beforeEach(() => {
        parser = new Parser(binData);
    })

    it("Setup successful.", () => {
        expect(parser.bufferLength()).toBe(260);
    })
})
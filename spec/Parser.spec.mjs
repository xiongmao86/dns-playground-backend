import fs from 'fs';
import Parser from '../Parser.js'

const binData = fs.readFileSync('./spec/assets/dns_response.binary');
let parser = new Parser(binData);

describe("Parser", () => {
    it("Setup successful.", () => {
        expect(parser.bufferLength()).toBe(260);
    })
})
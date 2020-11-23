import fs from 'fs';
import Parser from '../Parser.js'

describe("Parser", () => {
    let parser;
    let result;
    beforeEach(() => {
        const binData = fs.readFileSync('./spec/assets/dns_response.binary');
        parser = new Parser(binData);
        result = parser.parse();
    })
    it("Setup successful.", () => {
        expect(parser.bufferLength()).toBe(260);
    })

    it("should parse id", () => {
        expect(result.id).toBe("0x867f");
    })

    it("should parse flags", () => {
        let flags = result.flags;
        expect(flags.response).toBe(1);
        expect(flags.opcode).toBe(0);
        expect(flags.authoritative).toBe(0);
        expect(flags.truncated).toBe(0);
        expect(flags.recursion_desired).toBe(1);
        expect(flags.recursion_available).toBe(1);
        expect(flags.z).toBe(0);
        expect(flags.authentic_data).toBe(0);
        expect(flags.checking_disable).toBe(0);
        expect(flags.error_code).toBe(0);
    })

    it("should parse counts", () => {
        expect(result.query_count).toBe(1);
        expect(result.answer_count).toBe(3);
        expect(result.authority_count).toBe(5);
        expect(result.additional_information_count).toBe(5);
    })
    
    // it("should parse counts", () => {
    //     expect(result.query_count).toBe(1);
    // })
})
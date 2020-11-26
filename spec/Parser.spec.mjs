import fs from 'fs';
import Parser from '../Parser.js'

describe("Parser", () => {
    describe("parsing header", () => {
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
    })
    
    it("should parse label", () => {
        let www = Buffer.from('www');
        let p1 = new Parser(www);
        expect(p1.parse_query_label(3)).toBe('www');

        let baidu = Buffer.from('baidu');
        let p2 = new Parser(baidu);
        expect(p2.parse_query_label(5)).toBe('baidu');

        let com = Buffer.from('com');
        let p3 = new Parser(com);
        expect(p3.parse_query_label(3)).toBe('com');
    })

    it("should parse name", () => {
        let buf = Buffer.alloc(15);
        buf[0] = 3;
        buf.write('www', 1, 'ascii');
        buf[4] = 5;
        buf.write('baidu',5, 'ascii');
        buf[10] = 3;
        buf.write('com', 11, 'ascii');
        buf[15] = 0;

        let p = new Parser(buf);
        expect(p.parse_query_name()).toEqual(['www', 'baidu', 'com']);
    })
})
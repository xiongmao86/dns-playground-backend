import fs from 'fs';
import Parser from '../Parser.js'

describe("Parser", () => {
    // TODO will decouple dependencies of this.
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

        it("should parse querys", () => {
            expect(result.querys.length).toBe(1);
            let query = result.querys[0];
            expect(query.name).toBe('www.baidu.com');
            expect(query.type).toBe('A');
            expect(query.klass).toBe('IN');
        })
    })

    it("should parse counts", () => {
        let qc = Buffer.from([0x00, 0x01]);
        let ac = Buffer.from([0x00, 0x03]);
        let auc = Buffer.from([0x00, 0x05]);
        expect(new Parser(qc).readUInt16()).toBe(1);
        expect(new Parser(ac).readUInt16()).toBe(3);
        expect(new Parser(auc).readUInt16()).toBe(5);
    })
    
    it("should parse id", () => {
        let u16 = [ 0x86, 0x7f];
        let buf = Buffer.from(u16);
        let p = new Parser(buf);;
        expect(p.parse_id()).toBe("0x867f");
    })

    it("should parse flags", () => {
        let buf = Buffer.from([0x81, 0x80]);
        let p = new Parser(buf);
        let flags = p.parse_flags();
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
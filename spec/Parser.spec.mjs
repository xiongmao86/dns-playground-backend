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

    it("should get pointee", () => {
        let p = new Parser();
        p.pointees.push({
            pos: 0,
            name: 'www.baidu.com'
        });
        p.pointees.push({
            pos: 4,
            name: 'baidu.com'
        });

        expect(p.pointees.length).toBe(2);
        expect(p.getPointee(0)).toBe('www.baidu.com');
        expect(p.getPointee(4)).toBe('baidu.com');
    })

    it("should parse name", () => {
        let buf = Buffer.alloc(15);
        buf[0] = 3;
        buf.write('www', 1, 'ascii');
        buf[4] = 5;
        buf.write('baidu',5, 'ascii');
        buf[10] = 3;
        buf.write('com', 11, 'ascii');
        buf[14] = 0;

        let p = new Parser(buf);
        expect(p.parse_query_name()).toEqual('www.baidu.com');
    })

    it("should update pointees", () => {
        let buf = Buffer.alloc(15);
        buf[0] = 3;
        buf.write('www', 1, 'ascii');
        buf[4] = 5;
        buf.write('baidu',5, 'ascii');
        buf[10] = 3;
        buf.write('com', 11, 'ascii');
        buf[14] = 0;
        let p = new Parser(buf);
        p.parse_query_name();

        expect(p.pointees.length).toBe(3);
        expect(p.getPointee(0)).toBe('www.baidu.com');
        expect(p.getPointee(4)).toBe('baidu.com');
        expect(p.getPointee(10)).toBe('com');
    })

    it("should parse query", () => {
        let buf = Buffer.alloc(19);
        buf[0] = 3;
        buf.write('www', 1, 'ascii');
        buf[4] = 5;
        buf.write('baidu',5, 'ascii');
        buf[10] = 3;
        buf.write('com', 11, 'ascii');
        buf[14] = 0;
        // qtype
        buf[15] = 0x00;
        buf[16] = 0x01;
        // qclass
        buf[17] = 0x00;
        buf[18] = 0x01;

        let query = new Parser(buf).parse_query();

        expect(query.name).toBe('www.baidu.com');
        expect(query.type).toBe('A');
        expect(query.klass).toBe('IN');
    })

    it("should parse with pointer", () => {
        let buf = Buffer.from([0xc0, 0x0c]);
        let p = new Parser(buf);
        p.pointees.push({
            pos: 0x0c,
            name: 'baidu.com'
        })
        
        // temporary bypass pointer_limit so that 
        // parsing should continue.
        p.pointer_limit = 0x0d;

        expect(p.parse_name_pointer()).toBe("baidu.com");
    })

    it("should parse type", () => {
        let type_a = Buffer.from([0x00, 0x01]);
        expect(new Parser(type_a).parse_type()).toBe('A');

        let type_cname = Buffer.from([0x00, 0x05]);
        expect(new Parser(type_cname).parse_type()).toBe('CNAME');
    })

    it("should parse class", () => {
        let class_in = Buffer.from([0x00, 0x01]);
        expect(new Parser(class_in).parse_class()).toBe("IN");
    })
})
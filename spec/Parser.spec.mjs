import fs from 'fs';
import Parser from '../Parser.js'

describe("Parser", () => {
    describe("functional test", () => {
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
        
        // 做完以后再测试这个
        // it("Should parse", () => {
        //     let answer0 = {
        //         "name": "www.baidu.com",
        //         "type": "CNAME",
        //         "klass": "IN",
        //         "time_to_live": 600,
        //         "data_length": 15,
        //         "canonical_name": "www.a.shifen.com"
        //     };
        //     let answer1 = {
        //         "name": "www.a.shifen.com",
        //         "type": "A",
        //         "klass": "IN",
        //         "time_to_live": 600,
        //         "data_length": 4,
        //         "rdata": "unrecognized"
        //     };
        //     expect(result.answers.length).toBe(3);
        //     expect(result.answers[0]).toEqual(answer0);
        //     expect(result.answers[1]).toEqual(answer1);
            
        //     let nameserver = {
        //         "name": "a.shifen.com",
        //         "type": "UNKNOWN",
        //         "klass": "IN",
        //         "time_to_live": 205,
        //         "data_length": 6,
        //         "rdata": "unrecognized"
        //     };
        //     expect(result.authoritative_nameservers.length).toBe(5);
        //     expect(result.authoritative_nameservers[0]).toEqual(nameserver)
            
        //     let additional1 = {
        //         "name": "ns1.a.shifen.com",
        //         "type": "A",
        //         "klass": "IN",
        //         "time_to_live": 466,
        //         "data_length": 4,
        //         "rdata": "unrecognized"
        //     };
        //     let additional2 = {
        //         "name": "ns5.a.shifen.com",
        //         "type": "A",
        //         "klass": "IN",
        //         "time_to_live": 353,
        //         "data_length": 4,
        //         "address": "180.76.76.95"
        //     };
        //     expect(result.additional_records.length).toBe(5);
        //     expect(result.additional_records[0]).toEqual(additional1);
        //     expect(result.additional_records[4]).toEqual(additional2);
        // })
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
        expect(p1.parse_label(3)).toBe('www');
        
        let baidu = Buffer.from('baidu');
        let p2 = new Parser(baidu);
        expect(p2.parse_label(5)).toBe('baidu');
        
        let com = Buffer.from('com');
        let p3 = new Parser(com);
        expect(p3.parse_label(3)).toBe('com');
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
        expect(p.parse_name()).toEqual('www.baidu.com');
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
        p.parse_name();
        
        expect(p.pointees.length).toBe(3);
        expect(p.getPointee(0)).toBe('www.baidu.com');
        expect(p.getPointee(4)).toBe('baidu.com');
        expect(p.getPointee(10)).toBe('com');
    })
    
    it("should update pointees end with a pointer", () => {
        let buf = Buffer.alloc(23);
        buf[0] = 3;
        buf.write('www', 1, 'ascii');
        buf[4] = 5;
        buf.write('baidu',5, 'ascii');
        buf[10] = 3;
        buf.write('com', 11, 'ascii');
        buf[14] = 0;
        
        buf[15] = 3;
        buf.write('ns1', 16, 'ascii');
        buf[19] = 0xc0;
        buf[20] = 0x04;

        buf[21] = 0xc0;
        buf[22] = 0x0f;
        
        let p = new Parser(buf);
        p.parse_name();
        p.parse_name();
        let last_pointer = p.parse_name();
        let pes = p.pointees;
        
        expect(pes.length).toBe(4);
        expect(p.getPointee(15)).toBe("ns1.baidu.com");
        expect(last_pointer).toBe("ns1.baidu.com");
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
        
        expect(p.parse_pointer()).toBe("baidu.com");
    })

    it("should parse address", () => {
        let buf = Buffer.from([0x0e, 0xd7, 0xb1, 0x26]);
        let res = new Parser(buf).parse_address();
        expect(res).toBe('14.215.177.38');
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
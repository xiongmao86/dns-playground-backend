import assert from 'assert';

class Parser {
    constructor(buffer) {
        this.buffer = buffer;
        this.i = 0;
        this.pointees = [];
    }

    bufferLength() {
        let buffer = this.buffer;
        return buffer? buffer.length : 0;
    }

    readUInt32() {
        let result = this.buffer.readUInt32BE(this.i);
        this.i += 4;
        return result;
    }

    readUInt16() {
        let result = this.buffer.readUInt16BE(this.i);
        this.i += 2;
        return result;
    }

    readUInt8() {
        let result = this.buffer.readUInt8(this.i);
        this.i += 1;
        return result;
    }

    getRange(len) {
        let end = this.i + len;
        let result = this.buffer.slice(this.i, end);
        this.i = end;

        return result;
    }

    parse_flags() {
        let flagbits = this.readUInt16();
        let qr = flagbits >>> 15;
        let opcode = flagbits >>> 11 & 0b1111;
        let aa = flagbits >>> 10 & 1;
        let tc = flagbits >>> 9 & 1;
        let rd = flagbits >>> 8 & 1;
        let ra = flagbits >>> 7 & 1;
        let z = flagbits >>> 6 & 1;
        let ad = flagbits >>> 5 & 1;
        let cd = flagbits >>> 4 & 1;
        let rcode = flagbits & 0b1111;

        return {
            response: qr,
            opcode,
            authoritative: aa,
            truncated: tc,
            recursion_desired: rd,
            recursion_available: ra,
            z,
            authentic_data: ad,
            checking_disable: cd,
            error_code: rcode
        }
    }

    parse_query_name() {
        let labels = [];
        let positions = [];
        while(true) {
            let pos = this.i;
            let n = this.readUInt8();
            if (n === 0) break;
            let label = this.parse_query_label(n);
            labels.push(label);
            positions.push(pos);
        }
        let name="";
        for(let i = positions.length - 1; i >= 0; i--) {
            name = labels.slice(i, positions.length).join(".");
            this.pointees.push({
                pos: positions[i],
                name
            })
        }
        return name;
    }

    parse_name_pointer() {
        let pointer = this.readUInt16();
        assert(pointer & 0b1100_0000_0000_0000, "should start with 0b11");
        return pointer & 0b0011_1111_1111_1111;
    }

    parse_query_label(n) {
        let range = this.getRange(n);
        let label = range.toString();
        
        return label;
    }

    parse_type() {
        let type = this.readUInt16();
        switch(type) {
            case 1:
                return "A";
            case 5:
                return "CNAME";
            default:
                return "UNKNOWN";
        }
    }

    parse_class() {
        let klass = this.readUInt16();
        if (klass === 1) return "IN";
        else return "UNKNOWN";
    }

    parse_query() {
        let qname = this.parse_query_name();
        let qtype = this.parse_type();
        let qclass = this.parse_class();

        return {
            name: qname,
            // will translate with type name
            type: qtype,
            klass: qclass
        };
    }

    parse_resource_record() {
        let rname = this.parse_query_name();
        let rtype = this.parse_type();
        let rclass = this.parse_class();
        let ttl = this.readUInt32();
        let rd_length = this.readUInt16();

        let rdata = this.getRange(rd_length);

        return {
            name: rname,
            type: rtype,
            klass: rclass,
            time_to_live: ttl,
            data_length: rd_length,
            rdata
        }
    }

    parse_id() {
        return "0x" + this.readUInt16().toString(16).padStart(4, '0');
    }

    parse() {
        let id = this.parse_id();
    
        let flags = this.parse_flags();
        let query_count = this.readUInt16();
        let answer_count = this.readUInt16();
        let authority_count = this.readUInt16();
        let additional_information_count = this.readUInt16();

        let querys = [];
        for(let i = 0; i < query_count; i++) {
            querys.push(this.parse_query());
        }

        return {
            id,
            flags,
            query_count,
            answer_count,
            authority_count,
            additional_information_count,
            querys
        }
    }
}

export default Parser;
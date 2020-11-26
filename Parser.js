class Parser {
    constructor(buffer) {
        this.buffer = buffer;
        this.i = 0;
    }

    bufferLength() {
        let buffer = this.buffer;
        return buffer? buffer.length : 0;
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

    parse_flags(flagbits) {
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
        while(true) {
            let n = this.readUInt8();
            if (n === 0) break;
            let label = this.parse_query_label(n);
            labels.push(label);
        }
        return labels;
    }

    parse_query_label(n) {
        let end = this.i + n;
        let label = this.buffer.toString('ascii', this.i, end);
        this.i = end;
        
        return label;
    }

    // parse_query() {
    //     let n = this.readUInt8();
        
    // }

    parse() {
        let id = "0x" + this.readUInt16().toString(16).padStart(4, '0');
    
        let flagbits = this.readUInt16();
        let flags = this.parse_flags(flagbits);
        let query_count = this.readUInt16();
        let answer_count = this.readUInt16();
        let authority_count = this.readUInt16();
        let additional_information_count = this.readUInt16();

        // let querys = [];
        // for(i in [...query_count]) {
        //     querys[i] = this.parse_query();
        // }

        // test
        let qname = this.parse_query_name();

        return {
            id,
            flags,
            query_count,
            answer_count,
            authority_count,
            additional_information_count,
        }
    }
}

export default Parser;
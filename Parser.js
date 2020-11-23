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

    parse() {
        let id = "0x" + this.readUInt16().toString(16).padStart(4, '0');
    
        let flagbits = this.readUInt16();
        let flags = this.parse_flags(flagbits);

        return {
            id,
            flags
        }
    }
}

export default Parser;
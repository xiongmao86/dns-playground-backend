import assert from 'assert'

class Builder {
    constructor() {
        this.errors = [];
        
        // default value
        // id
        this.id = 0;

        // flags
        this.qr = 0;
        this.opcode = 0;
        this.aa = 0;
        this.tc = 0;
        this.rd = 0;
        this.ra = 0;
        this.ad = 0;
        this.cd = 0;
        this.rcode = 0;

        // counts
        this.qdcount = 1;
        this.ancount = 0;
        this.nscount = 0;
        this.arcount = 0;

        // query
        this.qname = "";
        this.qtype = 0;
        this.qclass = 1;

        return this;
    }
    
    addOutOfRange(name) {
        this.errors.push(`${name} is out of range`);
    }
    
    invalidUnsigned16Bit(val) {
        return val < 0 || val > 0xffff;
    }

    invalidUnsigned4Bit(val) {
        return val < 0 || val > 0xff;
    }
    
    invalid1Bit(val) {
        return val < 0 || val > 1;
    }
    
    setField(val, name, invalidFn) {
        if (invalidFn(val)) {
            this.addOutOfRange(name);
        } else {
            this[name] = val;
        }
        return this;
    }

    set_id(id) {
        return this.setField(id, 'id', this.invalidUnsigned16Bit);
    }
    
    set_qr(qr) {
        return this.setField(qr, 'qr', this.invalid1Bit);
    }

    set_opcode(opcode) {
        return this.setField(opcode, 'opcode', this.invalidUnsigned4Bit);
    }

    set_aa(aa) {
        return this.setField(aa, 'aa', this.invalid1Bit);
    }

    set_tc(tc) {
        return this.setField(tc, 'tc', this.invalid1Bit);;
    }

    set_rd(rd) {
        return this.setField(rd, 'rd', this.invalid1Bit);
    }

    set_ra(ra) {
        return this.setField(ra, 'ra', this.invalid1Bit);
    }

    set_ad(ad) {
        return this.setField(ad, 'ad', this.invalid1Bit);
    }

    set_cd(cd) {
        return this.setField(cd, 'cd', this.invalid1Bit);
    }

    set_rcode(rcode) {
        return this.setField(rcode, 'rcode', this.invalidUnsigned4Bit);
    }

    set_qdcount(qdcount) {
        return this.setField(qdcount, 'qdcount', this.invalidUnsigned16Bit);
    }

    set_ancount(ancount) {
        return this.setField(ancount, 'ancount', this.invalidUnsigned16Bit);
    }

    set_nscount(nscount) {
        return this.setField(nscount, 'nscount', this.invalidUnsigned16Bit);
    }

    set_arcount(arcount) {
        return this.setField(arcount, 'arcount', this.invalidUnsigned16Bit);
    }

    invalidName() {
        //TODO update name constraint
        return false;
    }

    set_qname(qname) {
        return this.setField(qname, 'qname', this.invalidName);
    }

    set_qtype(qtype) {
        return this.setField(qtype, 'qtype', this.invalidUnsigned16Bit);
    }

    set_qclass(qclass) {
        return this.setField(qclass, 'qclass', this.invalidUnsigned16Bit);
    }
}

export default Builder;
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

    includeLabelTooLong(nameStr) {
        let labels = nameStr.split('.');
        for(let label of labels) {
            if (label.length > 63) {
                return {
                    tooLong: true,
                    label: label
                };
            }
        }
        return { tooLong: false, label: null};
    }

    domainNameTooLong(nameStr) {
        /* Consideration: 
         * I have doubts about the number name string 
         * should be checking.
         * 
         * 1. The limit specify in rfc1035 is 255, should I 
         * change it to 254 because names should end with domain
         * root which is represented as an octet of 0?
         * 
         * 2. Message compression can be applied to qname if the 
         * packet contains 2 or more querys. Simply checking 
         * against a number would make those donmain names
         * that are longer than limit but are capable to 
         * be compressed as shorter name under limit will
         * forbid to use.
         */
        return nameStr.length > 254;
    }

    setDomainName(str, fieldName) {
        let r = this.includeLabelTooLong(str);
        if(r.tooLong) {
            this.errors.push(`length of ${r.label} is longer than 63`);
        } else if(this.domainNameTooLong(str)) {
            this.errors.push(`${str} is too long`);
        } else {
            this[fieldName] = str;
        }
    }

    set_qname(qname) {
        return this.setDomainName(qname, 'qname');
    }

    set_qtype(qtype) {
        return this.setField(qtype, 'qtype', this.invalidUnsigned16Bit);
    }

    set_qclass(qclass) {
        return this.setField(qclass, 'qclass', this.invalidUnsigned16Bit);
    }
}

export default Builder;
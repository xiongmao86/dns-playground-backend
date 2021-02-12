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
        this.qtype = 1;
        this.qclass = 1;
        
        return this;
    }
    
    // assign from json
    from(obj) {
        if (obj.id) 
            this.set_id(obj.id);

        if (obj.qr)
            this.set_qr(obj.qr);
        if (obj.opcode)
            this.set_opcode(obj.opcode);
        if (obj.aa)
            this.set_aa(obj.aa);
        if (obj.tc)
            this.set_tc(obj.tc);
        if (obj.rd)
            this.set_rd(obj.rd);
        if (obj.ra)
            this.set_ra(obj.ra);
        if (obj.ad)
            this.set_ad(obj.ad);
        if (obj.cd)
            this.set_cd(obj.cd);
        if (obj.rcode)
            this.set_rcode(obj.rcode);

        if (obj.qdcount)
            this.set_qdcount(obj.qdcount);
        if (obj.ancount)
            this.set_ancount(obj.ancount);
        if (obj.nscount)
            this.set_nscount(obj.nscount);
        if (obj.arcount)
            this.set_arcount(obj.arcount);
        
        if (obj.qname)
            this.set_qname(obj.qname);
        if (obj.qtype)
            this.set_qtype(obj.qtype);
        if (obj.qclass)
            this.set_qclass(obj.qclass);
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

    includeEmptyLabel(nameStr) {
        let labels = nameStr.split('.');
        for(let label of labels) {
            if (label.length == 0) {
                return true;
            }
        }
        return false;
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
        } else if(this.includeEmptyLabel(str)) {
            this.errors.push(`${str} include empty label`);
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
    
    // The data struct which is used in udp socket send fucntion
    // should be the end result of this function.
    build() {  
        const header = this.build_header();
        const query = this.build_query();
        return Buffer.concat([header, query]);
    }
    
    build_header() {
        const s1 = this.build_id();
        const s2 = this.build_flags();
        const s3 = this.build_qdcount();
        const s4 = this.build_ancount();
        const s5 = this.build_nscount();
        const s6 = this.build_arcount();
        let r = Buffer.concat([s1, s2, s3, s4, s5, s6]);
    }
    
    build_id() {
        return this.buildUInt16(this.id);
    }
    
    build_qdcount() {
        return this.buildUInt16(this.qdcount);
    }
    
    build_ancount() {
        return this.buildUInt16(this.ancount);
    }
    
    build_nscount() {
        return this.buildUInt16(this.nscount);
    }
    
    build_arcount() {
        return this.buildUInt16(this.arcount);
    }
    
    buildUInt16(data) {
        let r = Buffer.alloc(2);
        r.writeUInt16BE(data);
        return r;
    }
    
    build_flags() {
        let r = Buffer.alloc(2);
        let i = 0;
        i |= this.qr << 15;
        i |= this.opcode << 11;
        i |= this.aa << 10;
        i |= this.tc << 9;
        i |= this.rd << 8;
        i |= this.ra << 7;
        i |= 0 << 6;
        i |= this.ad << 5;
        i |= this.cd << 4;
        i |= this.rcode;
        r.writeUInt16BE(i);
        return r;
    }
    
    build_query() {
        const qname = this.build_qname(this.qname);
        const qtype = this.buildUInt16(this.qtype);
        const qclass = this.buildUInt16(this.qclass);
        return Buffer.concat([qname, qtype, qclass]);
    }

    build_qname(qname) {
        let labels = qname.split('.');
        let list = [];
        for(let label of labels) {
            list.push(this.build_label(label));
        }
        list.push(Buffer.from([0x00]));
        return Buffer.concat(list);
    }

    build_label(label) {
        let len = Buffer.from([label.length]);
        let str = Buffer.from(label);
        return Buffer.concat([len, str]);
    }
}

export default Builder;
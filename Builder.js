import assert from 'assert'

class Builder {
    constructor() {
        this.errors = [];
        
        // default value
        this.id = 0;
        this.flags = 0;
        
        return this;
    }
    
    addOutOfRange(name) {
        this.errors.push(`${name} is out of range`);
    }
    
    invalidUInt16Bit(val) {
        return val < 0 || val > 0xffff;
    }
    
    invalid1Bit(val) {
        return val < 0 || val > 1;
    }
    
    setBit(i, uint, setOne) {
        let oneMasks = 1 << i;
        return setOne? uint | oneMasks : uint & ~oneMasks;
    }
    
    set_flag(i, bit, name) {
        if (this.invalid1Bit(bit)) {
            this.addOutOfRange(name);
        } else {
            this.flags = this.setBit(i, this.flags, bit === 1)
        }
    }
    
    set_id(id) {
        if (this.invalidUInt16Bit(id)) {
            this.addOutOfRange('id');
        }
        else {
            this.id = id;
        }

        return this;
    }
    
    set_qr(qr) {
        this.set_flag(15, qr, 'qr');
        return this;
    }

    set_aa(aa) {
        this.set_flag(10, aa, 'aa');
        return this;
    }

    set_tc(tc) {
        this.set_flag(9, tc, 'tc');
        return this;
    }

    set_rd(rd) {
        this.set_flag(8, rd, 'rd');
        return this;
    }

    set_ra(ra) {
        this.set_flag(7, ra, 'ra');
        return this;
    }

    set_ad(ad) {
        this.set_flag(5, ad, 'ad');
        return this;
    }

    set_cd(cd) {
        this.set_flag(4, cd, 'cd');
    }
}

export default Builder;
import assert from 'assert'

class Builder {
    constructor() {
        this.errors = [];
        
        // default value
        this.id = 0;

        return this;
    }

    addOutOfRange(name) {
        this.errors.push(`${name} is out of range`);
    }

    invalidUInt16(val) {
        return val < 0 || val > 0xffff;
    }

    // invalidOneBit(val) {
    //     return val < 0 || val > 1;
    // }

    // setBit(i, u8, setOne) {
    //     let oneMasks = 1 << i;
    //     return setOne? u8 | oneMasks: u8 & ~oneMasks;
    // }

    set_id(id) {
        if (this.invalidUInt16(id))
            this.addOutOfRange('id');
        else
            this.id = id;
    }

    // set_qr(qr) {
    //     if (!this.flags) this.flags = 0;

    //     if (this.invalidOneBit(qr)) {
    //         this.addOutOfRange('qr');
    //     } else {
    //         this.flags = this.setBit(15, this.flags, qr === 1)
    //     }
    // }
}

export default Builder;
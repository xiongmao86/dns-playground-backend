class Parser {
    constructor(buffer) {
        this.buffer = buffer;
        this.i = 0;
        // return this;
    }
    readUInt16() {
        let result = this.buffer.readUInt16LE(i);
        this.i += 2;
        return 
    }
    bufferLength() {
        let buffer = this.buffer;
        return buffer? buffer.length : 0;
    }
    parse() {
        return {
            id: this.readUInt16()
        }
    }
}

export default Parser;
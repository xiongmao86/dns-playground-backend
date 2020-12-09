import Builder from '../Builder.js'

describe("Builder", () => {
    let b;

    beforeEach(() => {
        b = new Builder();
    })

    it("should validate u16", () => {
        let over = 65536;
        let under = -1;
        let inside = 135;
        expect(b.invalidUInt16Bit(over)).toBe(true);
        expect(b.invalidUInt16Bit(under)).toBe(true);
        expect(b.invalidUInt16Bit(inside)).toBe(false);
    })

    it("should set id", () => {
        let id = 135;
        b.set_id(id);
        expect(b.id).toBe(135);
    })

    it("should set flag", () => {
        b.set_flag(15, 1, 'qr');
        expect(b.flags).toBe(0b1000_0000_0000_0000);

        b.flags = 0x800f;
        b.set_flag(15, 0, 'qr');
        expect(b.flags).toBe(0x000f);
    })
})
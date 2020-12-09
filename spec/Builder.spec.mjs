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
        expect(b.invalidUnsigned16Bit(over)).toBe(true);
        expect(b.invalidUnsigned16Bit(under)).toBe(true);
        expect(b.invalidUnsigned16Bit(inside)).toBe(false);
    })

    it("should set id", () => {
        let id = 135;
        b.set_id(id);
        expect(b.id).toBe(135);
    })

    it("should set valid values only", () => {
        b.setField(2, 'qr', b.invalid1Bit);
        // Invalid value won't set, so fall back to default
        expect(b.qr).toBe(0);
        expect(b.errors.length === 1);
        expect(b.errors[0]).toBe('qr is out of range');

        b.setField(1, 'qr', b.invalid1Bit);
        expect(b.qr).toBe(1);

        b.setField(0, 'qr', b.invalid1Bit);
    })
})
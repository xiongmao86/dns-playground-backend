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
        expect(b.invalidUInt16(over)).toBe(true);
        expect(b.invalidUInt16(under)).toBe(true);
        expect(b.invalidUInt16(inside)).toBe(false);
    })

    it("should set id", () => {
        let id = 135;
        b.set_id(id);
        expect(b.id).toBe(135);
    })
})
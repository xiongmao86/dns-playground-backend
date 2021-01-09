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

    it("should not set invalid labels", () => {
        const digit10 = "1234567890";
        const digit30 = `${digit10}${digit10}${digit10}`;
        // label.length should < 64;
        const badLabel = `${digit30}${digit30}1234`;
        const badName = `${badLabel}.baidu.com`;
        
        b.setDomainName(badName, "qname");
        expect(b.errors.length).toBe(1);
        expect(b.errors[0]).toEqual(`length of ${badLabel} is longer than 63`);
        expect(b.qname).toEqual('');

        b.setDomainName('www.baidu.com', "qname");
        expect(b.qname).toEqual('www.baidu.com');
    })
})
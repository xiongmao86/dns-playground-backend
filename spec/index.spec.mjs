import fs from 'fs';

const binData = fs.readFileSync('./spec/assets/dns_response.binary');

describe("Added libary jasmine", function() {
    it("should pass", function() {
        expect(binData.length).toBe(260);
    });
});
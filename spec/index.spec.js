describe("Added libary jasmine", function() {
    const fs = require('fs');
    const path = require('path');
    const binData = fs.readFileSync(
        path.join(__dirname, "assets", "dns_response.binary"));

    it("should pass", function() {
        expect(binData.length).toBe(260);
    });
});
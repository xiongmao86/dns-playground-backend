import Parser from "./Parser.js"

let buf = Buffer.alloc(20);
buf[0] = 3;
buf.write('www', 1, 'ascii');
buf[4] = 5;
buf.write('baidu',5, 'ascii');
buf[10] = 3;
buf.write('com', 11, 'ascii');
buf[14] 
buf[15] = 0;
// qtype
buf[16] = 0x01;
buf[17] = 0x00;
// qclass
buf[18] = 0x01;
buf[19] = 0x11;

let p = new Parser(buf);
debugger;
p.parse_query();
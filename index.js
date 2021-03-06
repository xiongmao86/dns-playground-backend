import fs from 'fs'
import dgram from 'dgram'
import express from 'express'
import cors from 'cors'
import Parser from './Parser.js'
import Builder from './Builder.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let client = dgram.createSocket('udp4');

const pack = {
    "id": '0x867f',
    "flags": {
      "response": 1,
      "opcode": 0x0000,
      "authoritative": 0,
      "truncated": 0,
      "recursion_desired": 1,
      "recursion_available": 1,
      "z": 0,
      "authentic_data": 0,
      "checking_disable": 0,
      "error_code": 0x0000,
    },
    "query_count": 1,
    "answer_count": 3,
    "authority_count": 5,
    "additional_information_count": 5,
    
    "querys": [{
      "name": "www.baidu.com",
      "type": "A",
      // class is a keyword of javascript so rename it to klass.
      "klass": "IN"
    }],
    "answers": [
      {
        "name": "www.baidu.com",
        "type": "CNAME",
        "klass": "IN",
        "time_to_live": 600,
        "data_length": 15,
        "canonical_name": "www.a.shifen.com"
      },
      {
        "name": "www.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 600,
        "data_length": 4,
        "address": "14.215.177.38"
      },
      {
        "name": "www.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 600,
        "data_length": 4,
        "address": "14.215.177.38"
      }
    ],
    "authoritative_nameservers": [
      {
        "name": "a.shifen.com",
        "type": "NS",
        "klass": "IN",
        "time_to_live": 205,
        "data_length": 6,
        "nameserver": "ns3.a.shifen.com"
      },
      {
        "name": "a.shifen.com",
        "type": "NS",
        "klass": "IN",
        "time_to_live": 205,
        "data_length": 6,
        "nameserver": "ns4.a.shifen.com"
      },
      {
        "name": "a.shifen.com",
        "type": "NS",
        "klass": "IN",
        "time_to_live": 205,
        "data_length": 6,
        "nameserver": "ns2.a.shifen.com"
      },
      {
        "name": "a.shifen.com",
        "type": "NS",
        "klass": "IN",
        "time_to_live": 205,
        "data_length": 6,
        "nameserver": "ns1.a.shifen.com"
      },
      {
        "name": "a.shifen.com",
        "type": "NS",
        "klass": "IN",
        "time_to_live": 205,
        "data_length": 6,
        "nameserver": "ns5.a.shifen.com"
      }
    ],
    "additional_records": [
      {
        "name": "ns1.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 466,
        "data_length": 4,
        "address": "61.135.165.224"
      },
      {
        "name": "ns2.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 497,
        "data_length": 4,
        "address": "220.181.33.32"
      },
      {
        "name": "ns3.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 465,
        "data_length": 4,
        "address": "112.80.255.253"
      },
      {
        "name": "ns4.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 138,
        "data_length": 4,
        "address": "14.215.177.229"
      },
      {
        "name": "ns5.a.shifen.com",
        "type": "A",
        "klass": "IN",
        "time_to_live": 353,
        "data_length": 4,
        "address": "180.76.76.95"
      }
    ]
  } // finish pack object

app.get('/default', cors(), (_req, resp) => {
  resp.json(pack)
});

app.get('/parse', cors(), (_req, resp) => {
  const binData = fs.readFileSync('./dns_query.binary');
  let result = new Parser(binData).parse();
  resp.json(result);
})

app.post('/send', cors(), (req, resp) => {
  // 1. receive post request
  let {packet, ip} = req.body;
  
  // 2. build binary buffer
  let b = new Builder();
  let buf = b.from(packet).build();
  
  // 3. send buffer to dns server
  client.send(buf, 53, ip, (err, bytes) => {
    if (err) {
    }
  });
  
  // 4. receive packet and response to newest message.
  // Message event will trigger twice to second request, 
  // We just need the last packet, so setting end.
  let count = 0;
  let end = 1;
  client.on("message", (msg, rinfo) => {
    console.log(`${count} ${end}: ${msg.toString('hex')}`)
    count++
    let { address, port } = rinfo;
    if (address === ip && port === 53 && count === end) {
      count = 0;
      end = end + 1;
      let result = new Parser(msg).parse();
      console.log("message end");
      resp.json(result);
    }
  })
})

app.options('/send', cors());

app.listen(port, () => console.log(`Example app listening on port ${port}`));

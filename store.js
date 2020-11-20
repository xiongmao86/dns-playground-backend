// TODO: 更改flags
// const query1 = {
//     "id": 0x7385,
    
//     "response": false,
//     "opcode": 0x0000,
//     "truncated": false,
//     "recursion-disired": true,
//     "z": false,
//     "authentic-data": false,
//     "checking-disabled": false,

//     "query-count": 1,
//     "answer-count": 0,
//     "authority-count": 0,
//     "additional-information-count": 0,

//     "querys": [{
//         "name": "collector.githubapp.com",
//         "type": "A",
//         "class": "IN"
//     }]
// };

// TODO: 更改flags
// const response1 = {
//     "id": 0x696f,

//     "response": true,
//     "opcode": 0x0000,
//     "authoritative": false,
//     "truncated": false,
//     "recursion-desired": true,
//     "recursion-available": true,
//     "z": false,
//     "authentic-data": false,
//     "checking-disabled": false,
//     "error-code": 0x0000,

//     "query-count": 1,
//     "answer-count": 2,
//     "authority-count": 0,
//     "additional-infomation-count": 0,

//     "querys": [{
//         "name": "s.f.360.cn",
//         "type": "A",
//         "class": "IN"
//     }],
//     "answers": [
//         {
//             "name": "s.f.360.cn",
//             "type": "CNAME",
//             "time-to-live": 142,
//             "data-length": 15,
//             "CNAME": "s.f.qh-lb.com"
//         },
//         {
//             "name": "s.f.qh-lb.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 142,
//             "data-length": 4,
//             "address": "221.181.72.250"
//         }
//     ]
// };

// const response2 = {
//     "id": 0x867f,
//     "flags": {
//         "response": true,
//         "opcode": 0x0000,
//         "authoritative": false,
//         "truncated": false,
//         "recursion-desired": true,
//         "recursion-available": true,
//         "z": false,
//         "authentic-data": false,
//         "checking-disable": false,
//         "error-code": 0x0000,
//     },
//     "query-count": 1,
//     "answer-count": 3,
//     "authority-count": 5,
//     "additional-information-count": 5,

//     "querys": [{
//         "name": "www.baidu.com",
//         "type": "A",
//         "class": "IN"
//     }],
//     "answers": [
//         {
//             "name": "www.baidu.com",
//             "type": "CNAME",
//             "class": "IN",
//             "time-to-live": 600,
//             "data-length": 15,
//             "CNAME": "www.a.shifen.com"
//         },
//         {
//             "name": "www.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 600,
//             "data-length": 4,
//             "address": "14.215.177.38"
//         },
//         {
//             "name": "www.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 600,
//             "data-length": 4,
//             "address": "14.215.177.38"
//         }
//     ],
//     "Authoritative-nameservers": [
//         {
//             "name": "a.shifen.com",
//             "type": "NS",
//             "class": "IN",
//             "time-to-live": 205,
//             "data-length": 6,
//             "name-server": "ns3.a.shifen.com"
//         },
//         {
//             "name": "a.shifen.com",
//             "type": "NS",
//             "class": "IN",
//             "time-to-live": 205,
//             "data-length": 6,
//             "name-server": "ns4.a.shifen.com"
//         },
//         {
//             "name": "a.shifen.com",
//             "type": "NS",
//             "class": "IN",
//             "time-to-live": 205,
//             "data-length": 6,
//             "name-server": "ns2.a.shifen.com"
//         },
//         {
//             "name": "a.shifen.com",
//             "type": "NS",
//             "class": "IN",
//             "time-to-live": 205,
//             "data-length": 6,
//             "name-server": "ns1.a.shifen.com"
//         },
//         {
//             "name": "a.shifen.com",
//             "type": "NS",
//             "class": "IN",
//             "time-to-live": 205,
//             "data-length": 6,
//             "name-server": "ns5.a.shifen.com"
//         }
//     ],
//     "additional-records": [
//         {
//             "name": "ns1.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 466,
//             "data-length": 4,
//             "address": "61.135.165.224"
//         },
//         {
//             "name": "ns2.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 497,
//             "data-length": 4,
//             "address": "220.181.33.32"
//         },
//         {
//             "name": "ns3.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 465,
//             "data-length": 4,
//             "address": "112.80.255.253"
//         },
//         {
//             "name": "ns4.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 138,
//             "data-length": 4,
//             "address": "14.215.177.229"
//         },
//         {
//             "name": "ns5.a.shifen.com",
//             "type": "A",
//             "class": "IN",
//             "time-to-live": 353,
//             "data-length": 4,
//             "address": "180.76.76.95"
//         }
//     ]
// };

// export default response2;
# shulian_server

复刻书连软件的时候，因为种种原因无法实现开发阶段的跨域请求，最终决定编写一个 node.js 的服务器用于解决跨域问题。

同时，书连的服务器因为创立时间较早，现运行时间过长的原因，其 api 的响应体内容较为庞大且难以清楚直观的获取到所需数据。重新编写服务器之后，软件直接访问本服务器便可清晰的获取到对应的数据。
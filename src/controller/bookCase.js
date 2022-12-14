const {createResponse} = require("../utils/createResponse");
const axios = require("axios");
const {getTimeStamp} = require("../utils/getTimeStamp");

const deleteOneBookFun = async (cookie, session, token, bid) => {
    try {
        const res = await axios.post('http://j.facerome.com/modules/article/bookcase.php',{
            "bid": bid,
            "act": "delete",
            "time": await getTimeStamp(),
            "jieqi_token": token
        }, {
            headers: {
                "SESSIONID": session,
                "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
                "Host": "j.facerome.com",
                "Connection": "Keep-Alive",
                "Accept-Encoding": "gzip",
                "Cookie": cookie,
                "Content-Type": "application/json"
            }
        })
        return res
    }catch (e) {
        throw e;
    }
}

const getBookCaseList = async (ctx) => {
    // const cookie = ctx.headers.cookie;
    const { session, token } = ctx.query;
    try {
        if (session && token){
            const res = await  axios.get('http://j.facerome.com/modules/article/bookcase.php', {
                headers: {
                    "SESSIONID": session,
                    "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
                    "Host": "j.facerome.com",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip",
                    // "Cookie": cookie,
                },
                params: {
                    "time": await getTimeStamp(),
                    "jieqi_token": token
                }
            })
            if (res.data.data.bookcaserows){
                ctx.body = await createResponse(200, "????????????", {
                    nowBookCaseNum: res.data.data.nowbookcase,
                    maxBookCaseNum: res.data.data.maxbookcase,
                    bookCaseList: res.data.data.bookcaserows
                })
            }else {
                ctx.body = await createResponse(501, "???????????????????????????", "");
            }
        }else {
            ctx.body = await createResponse(500, "?????????????????????", "");
        }
    }catch (e) {
        throw e;
    }
}

const deleteOneBook = async (ctx) => {
    const cookie = ctx.headers.cookie;
    const { session, token, bid } = ctx.request.body;
    try {
        if (cookie && session && token){
            if (bid){
                const res = await deleteOneBookFun(cookie, session ,token, bid);
                if (res.data.code === 0 && res.data.data.redirect_url === '/modules/article/bookcase.php'){
                    ctx.body = await createResponse(200, "????????????", "")
                }else {
                    ctx.body = await createResponse(501, "???????????????????????????", "");
                }
            }else {
                ctx.body = createResponse(500, "??????????????????????????????");
            }
        }else {
            ctx.body = await createResponse(500, "?????????????????????", "");
        }
    }catch (e) {
        throw e;
    }
}

const deleteMultiBooks = async (ctx) => {
    const cookie = ctx.headers.cookie;
    const { session, token, bids } = ctx.request.body;
    try {
        if (session && cookie && token){
            if (bids !== ""){
                // ?????? bids
                const bidsArr = bids.split('|');
                let isDelete = true;
                let errNum = 0;
                for (let i = 0; i < bidsArr.length; i++){
                    const res = await deleteOneBookFun(cookie, session, token, bidsArr[i]);
                    if (res.data.code !== 0 || res.data.data.redirect_url !== '/modules/article/bookcase.php'){
                        isDelete = false;
                        errNum ++;
                    }
                }
                if (isDelete){
                    ctx.body = await createResponse(200, "??????????????????", "");
                }else {
                    ctx.body = await createResponse(502, `????????????${bids.length}??? ?????????${ errNum }`, "");
                }
            }else {
                ctx.body = await createResponse(500, "??????????????????????????????");
            }
        }else {
            ctx.body = await createResponse(500, "?????????????????????", "");
        }
    }catch (e) {
        throw e;
    }
}

const addBook = async (ctx) => {
    const cookie = ctx.headers.cookie;
    const { session, token, aid } = ctx.request.body;
    try {
        if (cookie && session && token){
            if (aid !== ""){
                const res = await axios.post('http://j.facerome.com/modules/article/addbookcase.php', {
                    "bid": aid,
                    "time": await getTimeStamp(),
                    "jieqi_token": token
                }, {
                    headers: {
                        "SESSIONID": session,
                        "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
                        "Host": "j.facerome.com",
                        "Connection": "Keep-Alive",
                        "Accept-Encoding": "gzip",
                        "Cookie": cookie,
                        "Content-Type": "application/json"
                    }
                })
                if (res.data.data === "??????????????????????????????????????????"){
                    ctx.body = await createResponse(200, "???????????????????????????", "");
                }else {
                    ctx.body = await createResponse(501, "?????????????????????", "");
                }
            }else {
                ctx.body = await createResponse(500, "??????????????????????????????");
            }
        }else {
            ctx.body = await createResponse(500, "?????????????????????", "");
        }
    }catch (e) {
        throw e;
    }
}

module.exports = {
    getBookCaseList,
    deleteOneBook,
    deleteMultiBooks,
    addBook
}
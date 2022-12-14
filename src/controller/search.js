const {createResponse} = require("../utils/createResponse");
const {getTimeStamp} = require("../utils/getTimeStamp");
const {getBookIdRequest, getBookDetailRequest, getNextPageBook} = require('../request/searchBookRequest')
const axios = require("axios");

const getHotKeywords = async (ctx) => {

    try{
        const res = await axios.get('http://j.facerome.com/modules/article/toplist.php', {
            headers: {
                // "SESSIONID": session,
                "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
                "Host": "j.facerome.com",
                "Connextion": "Keep-Alive",
                "Accept-Encoding": "gzip",
                // "Cookie": cookie,
            },
            params: {
                order: 'postdata',
                sortid: 0,
                page: 1,
                time: await getTimeStamp(),
                // "jieqi_token": token
                "jieqi_token": ""
            }
        })
        if (res.data.data.articlerows.length > 0) {
            ctx.body = await createResponse(200, "获取成功", res.data.data.articlerows);
        } else {
            ctx.body = await createResponse(501, "系统错误请稍后重试", "");
        }
    }catch (e) {
        throw e;
    }

    // const cookie = ctx.headers.cookie;
    // const {session, token} = ctx.query;
    // try {
    //     if (cookie && session && token) {
    //         const res = await axios.get('http://j.facerome.com/modules/article/toplist.php', {
    //             headers: {
    //                 "SESSIONID": session,
    //                 "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
    //                 "Host": "j.facerome.com",
    //                 "Connextion": "Keep-Alive",
    //                 "Accept-Encoding": "gzip",
    //                 "Cookie": cookie,
    //             },
    //             params: {
    //                 order: 'postdata',
    //                 sortid: 0,
    //                 page: 1,
    //                 time: await getTimeStamp(),
    //                 "jieqi_token": token
    //             }
    //         })
    //         if (res.data.data.articlerows.length > 0) {
    //             ctx.body = await createResponse(200, "获取成功", res.data.data.articlerows);
    //         } else {
    //             ctx.body = await createResponse(501, "系统错误请稍后重试", "");
    //         }
    //     } else {
    //         ctx.body = await createResponse(500, "请重新登录账号");
    //     }
    // } catch (e) {
    //     throw e;
    // }
}

const getUserResult = async (ctx) => {
    const { keyWord } = ctx.request.body;
    try{
        if (keyWord){
            const res = await axios.get('http://j.facerome.com/userlist.php', {
                headers: {
                    // "SESSIONID": session,
                    "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
                    "Host": "j.facerome.com",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip",
                    // "Cookie": cookie,
                },
                params: {
                    "groupid": 0,
                    "keyword": keyWord,
                    "keytype": "name",
                    "time": await getTimeStamp(),
                    // "jieqi_token": token
                    "jieqi_token": ""
                }
            })
            if (res.data.data.userrows[0].name === keyWord) {
                ctx.body = await createResponse(200, "获取成功", res.data.data.userrows[0])
            } else {
                ctx.body = await createResponse(501, "系统错误请稍后重试", "");
            }
        }else{
            ctx.body = await createResponse(500, "系统错误请稍后重试", "");
        }
    }catch (e) {
        throw e;
    }

    // const cookie = ctx.headers.cookie;
    // const {session, token, keyWord} = ctx.request.body;
    // try {
    //     if (cookie && session && token && keyWord) {
    //         const res = await axios.get('http://j.facerome.com/userlist.php', {
    //             headers: {
    //                 "SESSIONID": session,
    //                 "user-agent": 'Mozilla/5.0 (Linux; Android 12; M2006J10C Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/34.909092)',
    //                 "Host": "j.facerome.com",
    //                 "Connection": "Keep-Alive",
    //                 "Accept-Encoding": "gzip",
    //                 "Cookie": cookie,
    //             },
    //             params: {
    //                 "groupid": 0,
    //                 "keyword": keyWord,
    //                 "keytype": "name",
    //                 "time": await getTimeStamp(),
    //                 "jieqi_token": token
    //             }
    //         })
    //         if (res.data.data.userrows[0].name === keyWord) {
    //             ctx.body = await createResponse(200, "获取成功", res.data.data.userrows[0])
    //         } else {
    //             ctx.body = await createResponse(501, "系统错误请稍后重试", "");
    //         }
    //     } else {
    //         ctx.body = await createResponse(500, "请重新登录账号", "");
    //     }
    // } catch (e) {
    //     throw e;
    // }
}

const getBookResult = async (ctx) => {

    const { keyWord } = ctx.request.body;
    try {
        if(keyWord){
            // 获取书籍id 或者 搜索结果
            const res = await getBookIdRequest(keyWord);

            if (res.totalResNum === 1){
                // 第一种情况
                // 获取信息
                const bookDetail = await getBookDetailRequest(res.resultId);
                if (bookDetail === "No Result"){
                    ctx.body = await createResponse(501, "系统错误请稍后重试", "");
                }else{
                    ctx.body = await createResponse(200, "获取成功", bookDetail);
                }
            }else if (res.totalResNum === 0){
                // 第三种情况
                ctx.body = await createResponse(501, "系统错误请稍后重试", "no results");
            }else {
                // 第二种情况
                ctx.body = await createResponse(200, "获取成功", res);
            }

            // if (res === "request fail"){
            //     ctx.body = await createResponse(501, "系统错误请稍后重试", "");
            // }else {
            //     // 获取信息
            //     const bookDetail = await getBookDetailRequest(res);
            //     if (bookDetail === "request fail"){
            //         ctx.body = await createResponse(501, "系统错误请稍后重试", "");
            //     }else {
            //         ctx.body = await createResponse(200, "获取成功", bookDetail);
            //     }
            // }
        }else {
            ctx.body = await createResponse(500, "系统错误请稍后重试", "");
        }
    }catch (e){
        throw e;
    }

    // const cookie = ctx.headers.cookie;
    // const { session, token, keyWord } = ctx.request.body;
    // try {
    //     if(cookie && session && token && keyWord){
    //         // 获取id
    //         const res = await getBookIdRequest(session, token, cookie, keyWord);
    //         if (res === "request fail"){
    //             ctx.body = await createResponse(501, "系统错误请稍后重试", "");
    //         }else {
    //             // 获取信息
    //             const bookDetail = await getBookDetailRequest(session, token, cookie, res);
    //             if (bookDetail === "request fail"){
    //                 ctx.body = await createResponse(501, "系统错误请稍后重试", "");
    //             }else {
    //                 ctx.body = await createResponse(200, "获取成功", bookDetail);
    //             }
    //         }
    //     }else {
    //         ctx.body = await createResponse(500, "请重新登录账号", "");
    //     }
    // }catch (e){
    //     throw e;
    // }
}

const getNextPageBookResult = async (ctx) => {
    const { keyWord, page } = ctx.request.body;
    try {
        if (keyWord && page){
            const res = await getNextPageBook(keyWord, page);
            if (res === ""){
                ctx.body = await createResponse(501, "系统错误请稍后重试", "no results");
            }else {
                ctx.body = await createResponse(200, "获取成功", res);
            }
        }
    }catch (e) {
        throw e;
    }
}

module.exports = {
    getHotKeywords,
    getUserResult,
    getBookResult,
    getNextPageBookResult
}
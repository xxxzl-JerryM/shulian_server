const Router = require('koa-router');
const { getBookCaseList, deleteOneBook, deleteMultiBooks} = require('../controller/bookCase');
const bookCaseRouter = new Router();

// 获取书架列表
bookCaseRouter.get('/list', getBookCaseList);
// 删除书架中的一本书
bookCaseRouter.post('/delete', deleteOneBook);
// 批量删除书架中的书本
bookCaseRouter.post('/delete/multi', deleteMultiBooks)

module.exports = bookCaseRouter;
import request from './request'

export default {
    list(params) {
        return request.httpGet("/admin/role/list", params);
    },
    one(params) {
        return request.httpGet("/admin/role/one", params);
    },
    create(params) {
        return request.httpPost("/admin/role/create", params);
    },
    update(params) {
        return request.httpPost("/admin/role/update", params);
    },
    del(params) {
        return request.httpPost("/admin/role/del", params);
    },
    getMenus(params) {
        return request.httpGet("/admin/role/menus", params);
    },
    saveMenus(params) {
        return request.httpPost("/admin/role/menus", params);
    },
}
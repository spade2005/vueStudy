import request from './request'

export default {
    list(params) {
        return request.httpGet("/admin/menu/list", params);
    },
    one(params) {
        return request.httpGet("/admin/menu/one", params);
    },
    create(params) {
        return request.httpPost("/admin/menu/create", params);
    },
    update(params) {
        return request.httpPost("/admin/menu/update", params);
    },
    del(params) {
        return request.httpPost("/admin/menu/del", params);
    },
}
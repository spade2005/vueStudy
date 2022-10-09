import request from './request'

export default {
    list(params) {
        return request.httpGet("/admin/config/list", params);
    },
    one(params) {
        return request.httpGet("/admin/config/one", params);
    },
    create(params) {
        return request.httpPost("/admin/config/create", params);
    },
    update(params) {
        return request.httpPost("/admin/config/update", params);
    },
    del(params) {
        return request.httpPost("/admin/config/del", params);
    },
}
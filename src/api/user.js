import request from './request'

export default {
    login(params) {
        return request.httpPost("/auth/login", params);
    },
    logout() {
        return request.httpPost("/auth/logout", []);
    },
    list(params) {
        return request.httpGet("/admin/user/list", params);
    },
    one(params) {
        return request.httpGet("/admin/user/one", params);
    },
    create(params) {
        return request.httpPost("/admin/user/create", params);
    },
    update(params) {
        return request.httpPost("/admin/user/update", params);
    },
    del(params) {
        return request.httpPost("/admin/user/del", params);
    },
    currentUser() {
        return request.httpGet("/admin/user");
    },
    updatePassword() {
        return request.httpPost("/admin/user/password");
    },
}
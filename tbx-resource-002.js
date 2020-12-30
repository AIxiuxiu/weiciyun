/*!***********************************************
 Copyright (c) 2019, Neusoft Inc.
 All rights reserved
 图表秀 Version 1.0.0 2020.4.24
 ************************************************/
"use strict";
charting.controller("resourceCtrl", ["$rootScope", "$scope", "$http", "$state", "$timeout", "$interval", "toaster", "$modal", "categoryManager", "chartBooksInfoManager", "chartBookDataManager", "shareManager", "$cookies", "$cookieStore", "Idle", "vipService", "StatisticsService", "$filter", "chartInstanceInfoManager", "chartInstanceDataManager", function (n, r, a, t, s, i, c, l, e, d, o, u, h, p, f, m, g, C, v, b) {
    r.local_server = local_server,
        r.ciStatistics = g.ciStatistics,
        r.ciCustomEvent = g.ciCustomEvent,
        r.chartbooks = [],
        r.chartInstances = [],
        r.chartbookCats = [],
        r.chartResources = [],
        r.favorites = [],
        r.catFilter = null,
        r.nameFilter = null,
        r.nameQuery = "",
        r.currentCat = "全部",
        r.chartBookCatogorys = [{
            id: 0,
            name: "全部"
        }],
        r.isLoaded = !1,
        r.moveflag = !1,
        r.demoFilter = {
            type: 1
        },
        r.boughtFilter = {
            type: 2
        },
        r.templateFilter = function (e) {
            return 1 === e.type || 2 === e.type
        },
        r.dynamicFilter = {
            type: 0
        },
        n.isSavedToServer = !0,
        n.isEverLogin = !1,
        r.frozenFilter = {
            isFrozen: !0
        },
        r.meltedFilter = {
            isFrozen: !1
        },
        n.pageShotInterval && clearInterval(n.pageShotInterval),
        r.seekMallTemplates = function () {
            "demo" !== n.userinfo.userid ? window.open(mall_server + "/templates") : c.pop("info", "", "注册后体验更多功能")
        };
    var y = r.$watch("nameQuery", function (o, e) {
        r.nameFilter = "" === o ? null : "我的收藏" === r.currentClass ? function (e, t) {
            return r.favorites[t] && 0 <= r.favorites[t].favorite.name.indexOf(o)
        } : {
                name: o
            }
    });
    n.fetchUserMessages = function () {
        a({
            method: "GET",
            url: charts_server + "/service/message/all?userId=" + n.userinfo.userid,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        }).then(function (e) {
            e.data.error ? console.error("error fetching user messages") : n.userMessagesAll = e.data.object.messages
        })
    },
        r.$on("$destroy", function () {
            y()
        });
    var I = {
        method: "GET",
        url: charts_server + "/service/user/info",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        }
    };
    a(I).then(function (e) {
        if (e)
            if (e.data.error)
                c.pop("error", "", "读取用户信息失败");
            else {
                n.userinfo = angular.copy(e.data.object);
                n.userinfo.vip.class = 6;
                n.userinfo.limit = {
                    "chartbookcount": 300,
                    "chartinstancecount": 300,
                    "pagecount": 50,
                    "iconcount": 490,
                    "themecount": 20,
                    "mediacapacity": 500,
                    "ismorecharts": true,
                    "ismoretheme": true,
                    "isnowatermark": true,
                    "isnologo": true,
                    "ispptexport": true,
                    "ishtmlexport": true,
                    "ischartexport": true,
                    "isnologoplay": true,
                    "isnologoshare": true,
                    "iscustomlogo": true,
                    "isurlresource": true,
                    "isimgexporthd": true,
                    "isfullcharts": true

                };

                if (n.userinfo.isLogin = !0, n.isEverLogin = e.data.object.isEverLogin, p.put("isEverLogin", n.isEverLogin), n.isNotEverLogin = !n.isEverLogin, n.userinfo.login = e.data.object.login, f.watch(), !n.isEverLogin) {

                    var t = (new UAParser).getBrowser().name;
                    n.showBrowserTip = "Chrome" !== t && "Firefox" !== t,
                        n.showBrowserTip && s(function () {
                            n.showBrowserTip = !1
                        }, 1e4),
                        n.app.settings.asideFolded = !1;
                    var o = {
                        method: "POST",
                        url: charts_server + "/service/user/info/setEverLogin",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                        },
                        data: "user_id=" + n.userinfo.userid
                    };
                    a(o).then(function (e) {
                        e.data.error && c.pop("error", "", "系统出错，请稍后再试")
                    }),
                        r.$emit("nologin")
                }
                window.parent !== window && (localStorage.setItem("ngStorage-userinfo", JSON.stringify(n.userinfo)), window.parent.postMessage("LOGIN_SUCCESS", local_server)),
                    n.isEverLogin && !localStorage.getItem("JuneUpdate") && l.open({
                        controller: "updateInfoModalCtrl",
                        templateUrl: "js/app/misc/update_info_modal/template-823dfe2abb.html",
                        windowClass: "update-info-modal",
                        size: "md",
                        backdrop: "static"
                    }).result.then(function () {
                        localStorage.setItem("JuneUpdate", "1")
                    }),
                    d.query().then(function (e) {
                        r.isLoaded = !0,
                            r.chartbooks = e,
                            n.totalChartbooksCount = _.where(r.chartbooks, {
                                type: 0
                            }).length,
                            _.each(r.chartbooks, function (e) {
                                e.resourceType = 0,
                                    e.isMyCoverImage ? e.coverImageStore = e.ownIconStore ? e.ownIconStore : e.iconStore : e.coverImageStore = e.iconStore
                            }),
                            v.query().then(function (e) {
                                r.chartInstances = e,
                                    n.totalChartInstancesCount = _.where(r.chartInstances, {
                                        type: 0
                                    }).length,
                                    _.each(r.chartInstances, function (e) {
                                        e.resourceType = 1
                                    }),
                                    r.chartResources = r.chartbooks.concat(r.chartInstances),
                                    r.chartResources = _.sortBy(r.chartResources, function (e) {
                                        return 0 == e.resourceType ? e.modifiedOn : e.lastUpdate
                                    }).reverse(),
                                    r.filter(),
                                    0 == n.totalChartbooksCount && 0 == n.totalChartInstancesCount && n.setChartBookClass(2)
                            })
                    }, function (e) {
                        r.isLoaded = !0
                    }),
                    n.userMessageFetchInterval || (n.fetchUserMessages(), n.userMessageFetchInterval = i(n.fetchUserMessages, 12e4)),
                    g.plowUser(n.userinfo.userid, n.userinfo.basic.username.content, m.vipClass[n.userinfo.vip[0].class].name),
                    g.ciTrackPageClick(local_server + "/src/app/charting_resource")
            }
    }, function (e) { }),
        r.$on("nologin", function () {
            n.showHelpV3 = !0
        });
    function k(e) {
        return _.union(["全部"], _.sortBy(_.uniq(_.map(e, function (e) {
            return e.category
        })), function (e) {
            return "其他" === e
        }))
    }
    r.filter = function () {
        r.delete.active && r.deleteCancel(),
            r.filterByClass(n.chartBookClasses[n.bookClassIndex])
    },
        r.filterByClass = function (e) {
            r.currentClass = e,
                r.filterByCat("全部"),
                r.nameFilter = null,
                r.nameQuery = "",
                "我的资源" === e ? (r.chartbookCats = k(_.where(r.chartbooks, {
                    ownerId: n.userinfo.userid
                })), r.dynamicFilter = {
                    ownerId: n.userinfo.userid
                }) : "我的模板" === e ? (r.chartbookCats = k(_.filter(r.chartbooks, r.templateFilter)), r.dynamicFilter = r.templateFilter) : d.queryFavorites().then(function (e) {
                    r.favorites = e,
                        0 < r.favorites.length ? r.chartbookCats = _.union(["全部"], _.sortBy(_.uniq(_.map(r.favorites, function (e) {
                            return e.favorite.category
                        })), function (e) {
                            return "其他" === e
                        })) : r.chartbookCats = ["全部"]
                }, function () {
                    c.pop("error", "", "获取已收藏图册失败")
                })
        },
        r.filterByCat = function (e) {
            var o = r.currentCat = e;
            r.catFilter = "全部" === o ? null : "我的收藏" === r.currentClass ? function (e, t) {
                return r.favorites[t] && r.favorites[t].favorite.category === o
            } : {
                    category: o
                }
        },
        r.createChartbook = function () {
            !_.isEmpty(r.chartbooks) && -1 !== n.userinfo.limit.bookcount && n.totalChartbooksCount >= n.userinfo.limit.bookcount ? n.userinfo.vip[0].class >= m.vipClass.length - 1 ? l.open({
                templateUrl: "tpl/charting/confirm_modal.html",
                controller: "ConfirmModalCtrl",
                size: "sm",
                resolve: {
                    msg: function () {
                        return angular.copy("您的图册数量上限已是最大，整理一下旧图册腾出空间吧~~")
                    }
                }
            }) : l.open({
                templateUrl: "tpl/security/pay_hint_modal.html",
                controller: "payHintModalCtrl"
            }) : t.go("app.charting_dashboard", {
                bookId: "",
                clearUndo: !0
            })
        },
        r.createChartInstance = function () {
            !_.isEmpty(r.chartInstances) && -1 !== n.userinfo.limit.chartcount && n.totalChartInstancesCount >= n.userinfo.limit.chartcount ? n.userinfo.vip[0].class >= m.vipClass.length - 1 ? l.open({
                templateUrl: "tpl/charting/confirm_modal.html",
                controller: "ConfirmModalCtrl",
                size: "sm",
                resolve: {
                    msg: function () {
                        return angular.copy("您的图表数量上限已是最大，整理一下旧图表腾出空间吧~~")
                    }
                }
            }) : l.open({
                templateUrl: "tpl/security/pay_hint_modal.html",
                controller: "payHintModalCtrl"
            }) : t.go("app.chart_instance_dashboard", {
                chartInstanceId: "",
                clearUndo: !0,
                actionType: "createChart"
            })
        },
        r.editChartBook = function (e) {
            t.go("app.charting_dashboard", {
                bookId: e,
                clearUndo: !0
            })
        },
        r.delete = {
            active: !1,
            bookList: [],
            favList: [],
            chartInstanceList: []
        },
        r.deleteToggle = function () {
            r.delete.active ? r.deleteCancel() : r.delete.active = !0
        },
        r.deleteMarkChartbook = function (e) {
            var t = r.delete.bookList.indexOf(e.id);
            0 <= t ? (r.delete.bookList.splice(t, 1), e.delete = !1) : (r.delete.bookList.push(e.id), e.delete = !0)
        },
        r.deleteMarkChartInstance = function (e) {
            var t = r.delete.chartInstanceList.indexOf(e.id);
            0 <= t ? (r.delete.chartInstanceList.splice(t, 1), e.delete = !1) : (r.delete.chartInstanceList.push(e.id), e.delete = !0)
        },
        r.deleteMarkResource = function (e) {
            var t = 0 == e.resourceType,
                o = t ? r.delete.bookList.indexOf(e.id) : r.delete.chartInstanceList.indexOf(e.id);
            0 <= o ? (t ? r.delete.bookList.splice(o, 1) : r.delete.chartInstanceList.splice(o, 1), e.delete = !1) : (t ? r.delete.bookList.push(e.id) : r.delete.chartInstanceList.push(e.id), e.delete = !0)
        },
        r.deleteMarkFavorite = function (e) {
            var t = r.delete.favList.indexOf(e.favorite.chartbookId);
            0 <= t ? (r.delete.favList.splice(t, 1), e.delete = !1) : (r.delete.favList.push(e.favorite.chartbookId), e.delete = !0)
        },
        r.deleteCancel = function () {
            r.delete.active = !1,
                r.delete.bookList = [],
                r.delete.favList = [],
                _.each(r.chartbooks, function (e) {
                    delete e.delete
                }),
                _.each(r.favorites, function (e) {
                    delete e.delete
                })
        },
        r.deleteSingleChartBook = function (e) {
            r.delete.bookList = [e.id],
                r.deleteChartBooks()
        },
        r.deleteSingleFav = function (e) {
            r.delete.favList = [e.favorite.chartbookId],
                r.removeFavorites()
        },
        r.deleteChartBooks = function () {
            l.open({
                scope: r,
                templateUrl: "tpl/charting/operationConfirm.html",
                controller: "ResourceChartbookCtrl",
                size: "sm"
            }).result.then(function () {
                o.delete(r.delete.bookList).then(function (e) {
                    d.query().then(function (e) {
                        r.isLoaded = !0,
                            r.chartbooks = e,
                            n.totalChartbooksCount = _.where(r.chartbooks, {
                                type: 0
                            }).length,
                            _.each(r.chartbooks, function (e) {
                                e.resourceType = 0,
                                    e.isMyCoverImage ? e.coverImageStore = e.ownIconStore ? e.ownIconStore : e.iconStore : e.coverImageStore = e.iconStore
                            }),
                            r.chartResources = r.chartbooks.concat(r.chartInstances),
                            r.chartResources = _.sortBy(r.chartResources, function (e) {
                                return 0 == e.resourceType ? e.modifiedOn : e.lastUpdate
                            }).reverse()
                    }, function (e) {
                        r.isLoaded = !0
                    }),
                        c.pop("success", "", "删除成功"),
                        n.totalChartbooksCount = n.totalChartbooksCount - r.delete.bookList.length,
                        r.delete.active = !1,
                        r.delete.bookList = []
                }, function (e) {
                    c.pop("error", "", "删除失败")
                })
            }, function () {
                console.info("cancel deleteChartBooks")
            })
        },
        r.playChartBook = function (e) {
            if (e.isFrozen)
                c.pop("warning", "", "图册已冻结，无法播放");
            else if (e.sharing)
                r.playSharedChartBook(e.sharing);
            else {
                var t = "../p.html?c=" + e.id;
                window.open(t)
            }
        },
        r.playChartInstance = function (e) {
            if (e.isFrozen)
                c.pop("warning", "", "图表已冻结，无法播放");
            else if (e.sharing)
                r.playSharedChartInstance(e.sharing);
            else {
                var t = "../p.html?c=" + e.id + "&isChart=" + !0;
                window.open(t)
            }
        },
        r.shareChartBook = function (e) {
            e.isFrozen ? c.pop("warning", "", "图册已冻结，无法分享") : u.shareChartBook(e)
        },
        r.shareChartInstance = function (e) {
            e.isFrozen ? c.pop("warning", "", "图表已冻结，无法分享") : u.shareChartInstance(e)
        },
        r.playSharedChartBook = function (e) {
            var t = "../p.html?s=" + e.code;
            window.open(t)
        },
        r.playSharedChartInstance = function (e) {
            var t = "../p.html?s=" + e.code + "&isChart=" + !0;
            window.open(t)
        },
        r.playFavorite = function (e) {
            e.info ? e.sharing ? r.playSharedChartBook(e.sharing) : c.pop("error", "", "该图册已取消分享，您无法查看") : c.pop("error", "", "该图册已被删除")
        },
        r.removeFavorites = function () {
            l.open({
                scope: r,
                templateUrl: "tpl/charting/operationConfirm.html",
                controller: ["$scope", "$modalInstance", function (e, t) {
                    e.message = "确定要取消收藏吗？",
                        e.dismiss = function () {
                            t.dismiss()
                        },
                        e.submit = function () {
                            t.close()
                        }
                }],
                size: "sm"
            }).result.then(function () {
                d.removeFavorite(r.delete.favList).then(function (e) {
                    e && e.error ? c.pop("error", "", "取消收藏失败") : (c.pop("success", "", "取消收藏成功"), r.favorites = _.reject(r.favorites, function (e) {
                        return _.contains(r.delete.favList, e.favorite.chartbookId)
                    }), r.delete.active = !1, r.delete.favList = [])
                }, function () {
                    c.pop("error", "", "系统错误，请稍后再试")
                })
            })
        },
        r.handleTemplateExpire = function (e) {
            l.open({
                templateUrl: "tpl/security/product_warning_modal.html",
                controller: "productExpiredWarningModalCtrl",
                size: "sm",
                resolve: {
                    params: function () {
                        return angular.copy({
                            msgs: 2 === e.type ? ["该模板已过期"] : ["该图册所依赖的模板已过期"],
                            submitText: "去续期",
                            url: mall_server + (e.templateOwning.url ? e.templateOwning.url : "")
                        })
                    }
                }
            })
        },
        r.deleteChartInstance = function (e) {
            r.delete.chartInstanceList = [e.id],
                r.deleteChartInstances()
        },
        r.deleteChartInstances = function () {
            l.open({
                scope: r,
                templateUrl: "tpl/charting/operationConfirm.html",
                controller: "ResourceChartbookCtrl",
                size: "sm"
            }).result.then(function () {
                b.delete(r.delete.chartInstanceList).then(function (e) {
                    v.query().then(function (e) {
                        r.isLoaded = !0,
                            r.chartInstances = e,
                            n.totalChartInstancesCount = _.where(r.chartInstances, {
                                type: 0
                            }).length,
                            _.each(r.chartInstances, function (e) {
                                e.resourceType = 1
                            }),
                            r.chartResources = r.chartbooks.concat(r.chartInstances),
                            r.chartResources = _.sortBy(r.chartResources, function (e) {
                                return 0 == e.resourceType ? e.modifiedOn : e.lastUpdate
                            }).reverse()
                    }, function () {
                        r.isLoaded = !0,
                            console.error("chartBooksInfoManager.query() --\x3eerror")
                    }),
                        n.totalChartInstancesCount = n.totalChartInstancesCount - r.delete.chartInstanceList.length,
                        c.pop("success", "", "删除成功"),
                        r.delete.active = !1,
                        r.delete.chartInstanceList = []
                }, function (e) {
                    c.pop("info", "", "系统正忙，请稍后再试"),
                        console.error(e)
                })
            }, function () {
                console.info("cancel deleteChartInstances")
            })
        },
        r.deleteChartResource = function () {
            l.open({
                scope: r,
                templateUrl: "tpl/charting/operationConfirm.html",
                controller: "ResourceChartbookCtrl",
                size: "sm"
            }).result.then(function () {
                0 != r.delete.bookList.length && o.delete(r.delete.bookList).then(function (e) {
                    d.query().then(function (e) {
                        r.isLoaded = !0,
                            r.chartbooks = e,
                            n.totalChartbooksCount = _.where(r.chartbooks, {
                                type: 0
                            }).length,
                            _.each(r.chartbooks, function (e) {
                                e.resourceType = 0,
                                    e.isMyCoverImage ? e.coverImageStore = e.ownIconStore ? e.ownIconStore : e.iconStore : e.coverImageStore = e.iconStore
                            }),
                            r.chartResources = r.chartbooks.concat(r.chartInstances),
                            r.chartResources = _.sortBy(r.chartResources, function (e) {
                                return 0 == e.resourceType ? e.modifiedOn : e.lastUpdate
                            }).reverse()
                    }, function (e) {
                        r.isLoaded = !0
                    }),
                        n.totalChartbooksCount = n.totalChartbooksCount - r.delete.bookList.length,
                        c.pop("success", "", "删除成功"),
                        r.delete.active = !1,
                        r.delete.bookList = []
                }, function (e) {
                    c.pop("error", "", "删除失败")
                }),
                    0 != r.delete.chartInstanceList.length && b.delete(r.delete.chartInstanceList).then(function (e) {
                        v.query().then(function (e) {
                            r.isLoaded = !0,
                                r.chartInstances = e,
                                n.totalChartInstancesCount = _.where(r.chartInstances, {
                                    type: 0
                                }).length,
                                _.each(r.chartInstances, function (e) {
                                    e.resourceType = 1
                                }),
                                r.chartResources = r.chartbooks.concat(r.chartInstances),
                                r.chartResources = _.sortBy(r.chartResources, function (e) {
                                    return 0 == e.resourceType ? e.modifiedOn : e.lastUpdate
                                }).reverse()
                        }, function () {
                            r.isLoaded = !0
                        }),
                            n.totalChartInstancesCount = n.totalChartInstancesCount - r.delete.chartInstanceList.length,
                            c.pop("success", "", "删除成功"),
                            r.delete.active = !1,
                            r.delete.chartInstalceList = []
                    }, function (e) {
                        c.pop("info", "", "系统正忙，请稍后再试"),
                            console.error(e)
                    })
            }, function () {
                console.info("cancel deleteChartResource")
            })
        },
        r.initToolTip = function () {
            $("#chartbook").tooltip("show")
        }
}]),
    charting.controller("BindPhoneCtrl", ["$scope", "$rootScope", "$modal", "$modalInstance", "$http", "toaster", function (t, o, n, r, a, s) {
        t.type = 1,
            t.binding_phone_hint = "输入手机号码",
            t.getBindPhoneCode = function () {
                var e = {
                    method: "POST",
                    url: charts_server + "/service/user/binding/verifycode",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: "phone=" + t.binding_phone + "&type=" + t.type
                };
                a(e).then(function (e) {
                    e.data.error ? s.pop("error", "", "获取验证码失败:" + e.data.error.m) : s.pop("success", "", "验证码已发送到您的手机")
                }).catch(function (e) {
                    s.pop("error", "", "获取验证码失败")
                })
            },
            t.submit = function () {
                r.dismiss();
                var e = {
                    method: "POST",
                    url: charts_server + "/service/user/binding/local",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: "local=" + t.binding_phone + "&code=" + t.binding_phone_code + "&type=" + t.type
                };
                a(e).then(function (e) {
                    if (e.data.error)
                        if ("SEC-116" == e.data.error.c)
                            n.open({
                                templateUrl: "tpl/security/set_password.html",
                                controller: "BindPhonePassCodeProfileCtrl",
                                size: "sm",
                                resolve: {
                                    bind_tel: function () {
                                        return t.binding_phone
                                    },
                                    bind_code: function () {
                                        return t.binding_phone_code
                                    },
                                    bind_type: function () {
                                        return t.type
                                    }
                                }
                            });
                        else
                            s.pop("error", "", "绑定失败:" + e.data.error.m);
                    else
                        0 == t.bind_type ? o.userinfo.login.local_email = t.binding_phone : o.userinfo.login.local_mobile = t.binding_phone,
                            o.isBoundPhone = !0,
                            s.pop("success", "", "绑定成功")
                })
            },
            t.dismiss = function () {
                r.dismiss()
            }
    }]),
    charting.controller("BindPhonePassCodeProfileCtrl", ["$scope", "$rootScope", "$modalInstance", "$http", "toaster", "bind_tel", "bind_code", "bind_type", function (t, o, n, r, a, e, s, i) {
        t.bind_tel = e,
            t.bind_code = s,
            t.bind_type = i,
            t.submit = function () {
                if (t.binding_passcode == t.repeat_passcode)
                    if (t.binding_passcode.length < 6)
                        a.pop("error", "", "密码长度至少6位");
                    else {
                        (function (e) {
                            var t = 0;
                            if (e.length < 1)
                                return t;
                            if (e.length < 6)
                                return 1;
                            switch (6 == e.length && t++, /\d/.test(e) && t++, /[a-z]/.test(e) && t++, /[A-Z]/.test(e) && t++, /\W/.test(e) && t++, t) {
                                case 1:
                                    return 1;
                                case 2:
                                    return 2;
                                case 3:
                                case 4:
                                    return e.length < 12 ? 3 : 4;
                                default:
                                    return 4
                            }
                        })(t.binding_passcode) < 3 && a.pop("warn", "", "密码较弱，建议至少包含数字、字母或其他字符中的两种");
                        var e = {
                            method: "POST",
                            url: charts_server + "/service/user/binding/setcode",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data: "phone=" + t.bind_tel + "&password=" + CryptoJS.SHA256(t.binding_passcode) + "&code=" + t.bind_code + "&type=" + t.bind_type
                        };
                        r(e).then(function (e) {
                            console.log("开始进行验证码验证"),
                                e.data.error ? a.pop("error", "", "绑定失败:" + e.data.error.m) : (0 == t.bind_type ? o.userinfo.login.local_email = t.bind_tel : o.userinfo.login.local_mobile = t.bind_tel, n.close(), a.pop("success", "", "绑定成功"))
                        }).catch(function (e) {
                            a.pop("error", "", "绑定失败")
                        })
                    }
                else
                    a.pop("error", "", "两次输入密码不一致")
            },
            t.dismiss = function () {
                n.dismiss()
            }
    }]),
    charting.controller("ResourceChartbookCtrl", ["$rootScope", "$scope", "$http", "$timeout", "chartBookDataManager", "$modalInstance", "toaster", "$state", function (e, t, o, n, r, a, s, i) {
        t.message = "确定要删除吗?",
            t.dismiss = function () {
                a.dismiss()
            },
            t.submit = function () {
                a.close()
            }
    }]),
    charting.controller("ConfirmModalCtrl", ["$scope", "$modalInstance", "msg", function (e, t, o) {
        e.msg = o,
            e.submit = function () {
                t.close()
            }
    }]),
    charting.controller("payHintModalCtrl", ["$scope", "$rootScope", "$state", "$modalInstance", "vipService", function (e, t, o, n, r) {
        e.isNormalVip = r.isNormalVip,
            e.hasVerifiedPhone = function () {
                var e = r.isPhoneValid(t.userinfo.login.local_mobile);
                return e && ($("#phone").text("手机已验证"), $("#phone").addClass("btn-success")), e
            },
            e.hasVerifiedEmail = function () {
                var e = r.isEmailValid(t.userinfo.login.local_email);
                return e && ($("#email").text("邮箱已验证"), $("#email").addClass("btn-success")), e
            },
            e.goPayIntro = function () {
                n.close(),
                    o.go("app.vip_intro")
            },
            e.goVerify = function (e) {
                n.close(),
                    o.go("app.verify", {
                        type: e
                    })
            },
            e.dismiss = function () {
                n.dismiss()
            }
    }]);


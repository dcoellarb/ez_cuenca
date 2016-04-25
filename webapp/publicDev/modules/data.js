/**
 * Created by dcoellar on 11/18/15.
 */

angular.module("ez-Data",[])
    .provider('dataService',function dataServiceProvider() {

        this.initialize = function(application_id,client_id){
            Parse.initialize(application_id, client_id);
        }

        this.$get = function dataServiceFactory() {
            var buildFilter = function(query,filter) {
                switch (filter.operator) {
                    case "=":
                        query.equalTo(filter.field, filter.value);
                        break;
                    case ">":
                        query.greaterThan(filter.field, filter.value);
                        break;
                    case ">=":
                        query.greaterOrEqualTo(filter.field, filter.value);
                        break;
                    case "<":
                        query.lessThan(filter.field, filter.value);
                        break;
                    case "<=":
                        query.lessOrEqualTo(filter.field, filter.value);
                        break;
                    case "!=":
                        if (filter.value === undefined){
                            query.exists(filter.field);
                        } else {
                            query.notEqualTo(filter.field, filter.value);
                        }
                        break;
                    case "containsAll":
                        query.containsAll(filter.field, filter.value);
                        break;
                    case "startsWith":
                        query.startsWith(filter.field, filter.value);
                        break;
                }
            };
            var buildQuery = function(collection,params) {
                var entity = Parse.Object.extend(collection);

                if (params){
                    var filters = params.filters;
                    var orders = params.orders;
                    var includes = params.includes;

                    var query;

                    if (filters){
                        var orFilters = filters.filter(function (filter) {return filter.type == "or";});
                        var andFilters = filters.filter(function (filter) {return filter.type == "and";})

                        if (orFilters.length > 0) {
                            var orQueries = [];
                            if (Array.isArray(orFilters)) {
                                orFilters.forEach(function (e, i, a) {
                                    var q = new Parse.Query(entity);
                                    buildFilter(q, e)
                                    orQueries.push(q);
                                });
                            } else {
                                orQueries.push(orFilters);
                            }
                            query = Parse.Query.or(orQueries);
                        } else {
                            query = new Parse.Query(entity);
                        }

                        if (andFilters.length > 0){
                            if (Array.isArray(andFilters)) {
                                andFilters.forEach(function (e, i, a) {
                                    buildFilter(query, e);
                                });
                            }else{
                                buildFilter(query, andFilters);
                            }
                        }
                    } else {
                        query = new Parse.Query(entity);
                    }

                    if (orders){
                        orders.forEach(function(e,i,a){
                            if (e.ascending){
                                query.addAscending(e.field);
                            }else{
                                query.addDescending(e.field);
                            }
                        });
                    }

                    if (includes){
                        includes.forEach(function(e,i,a){
                            query.include(e);
                        });
                    }
                } else {
                    query = new Parse.Query(entity);
                }

                return query;
            };
            var updateFields = function(object,params) {
                if (params && params.updatedFields){
                    params.updatedFields.forEach(function(e,i,a){
                        switch (e.operator){
                            case "set":
                                object.set(e.field, e.value);
                                break;
                            case "increment":
                                object.increment(e.field);
                                break;
                            case "add":
                                object.add(e.field, e.value);
                                break;
                            case "addUnique":
                                object.addUnique(e.field, e.value);
                                break;
                            case "remove":
                                object.remove(e.field, e.value);
                                break;
                            case "unset":
                                object.unset(e.field, e.value);
                                break;
                        }
                    });
                }
                return object;
            };
            var buildACL = function(params) {
                var acl;
                if (params.acl) {
                    if (params.acl.currentUser){
                        acl = new Parse.ACL(Parse.User.current());
                    } else {
                        acl = new Parse.ACL();
                    }
                    params.acl.permissions.forEach(function (e,i,a){
                        if (e.isRole) {
                            acl.setRoleReadAccess(e.role, e.allowRead);
                            acl.setRoleWriteAccess(e.role, e.allowWrite);
                        } else {
                            acl.setReadAccess(e.id,  e.allowRead);
                            acl.setWriteAccess(e.id, e.allowWrite);
                        }
                    });
                }
                return acl;
            }

            return {
                //Security and context methods
                currentUser: function() {
                    return Parse.User.current();
                },
                login: function (username, password) {
                    if (Parse.User.current()){
                        Parse.User.logOut();
                    }
                    return Rx.Observable.create(function (observer) {
                        Parse.User.logIn(username, password, {
                            success: function (user) {
                                observer.onNext(user);
                                observer.onCompleted();
                            },
                            error: function (user, error) {
                                console.log("Parse Error: on login:");
                                console.log("Parse Error: " + error.code + " " + error.message);
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },
                logout: function () {
                    return Rx.Observable.create(function (observer) {
                        Parse.User.logOut();
                        observer.onNext();
                        observer.onCompleted();

                        return function () {
                        }
                    })
                },
                signup: function (username, email, password){
                    return Rx.Observable.create(function (observer) {
                        var user = new Parse.User();
                        user.set("username", username);
                        user.set("email", email);
                        user.set("password", password);
                        user.signUp(null, {
                            success: function(user) {
                                observer.onNext(user)
                                observer.onCompleted();
                            },
                            error: function(user, error) {
                                console.log("Parse Error: on signup:");
                                console.log("Parse Error: " + error.code + " " + error.message);
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },

                //utilities
                createCollection: function(collection, params){
                    var ParseObject = Parse.Object.extend(collection);
                    var parseObject = new ParseObject();
                    return parseObject;
                },

                //CRUD methods
                count: function (collection, params) {
                    var query = buildQuery(collection, params);

                    return Rx.Observable.create(function (observer) {
                        query.count({
                            success: function (count) {
                                observer.onNext(count);
                                observer.onCompleted();
                            },
                            error: function (error) {
                                console.log("Parse Error: on collection:" + params.collection);
                                console.log("Parse Error: " + error.code + " " + error.message);
                                if (error.code == 209) {
                                    Parse.User.logOut();
                                }
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },
                getAll: function (collection, params) {
                    var query = buildQuery(collection, params);

                    return Rx.Observable.create(function (observer) {
                        query.find({
                            success: function (objects) {
                                observer.onNext(objects);
                                observer.onCompleted();
                            },
                            error: function (error) {
                                console.log("Parse Error: on collection:" + collection);
                                console.log("Parse Error: " + error.code + " " + error.message);
                                if (error.code == 209) {
                                    Parse.User.logOut();
                                }
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },
                get: function (collection, params) {
                    var query = buildQuery(collection, params);

                    return Rx.Observable.create(function (observer) {
                        query.get(params.id, {
                            success: function (object) {
                                observer.onNext(object);
                                observer.onCompleted();
                            },
                            error: function (error) {
                                console.log("Parse Error: on collection:" + collection);
                                console.log("Parse Error: " + error.code + " " + error.message);
                                if (error.code == 209) {
                                    Parse.User.logOut();
                                }
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },
                add: function (collection, object, params) {
                    var acl = buildACL(params);
                    if (acl){
                        object.setACL(acl);
                    }

                    return Rx.Observable.create(function (observer) {
                        object.save(null, {
                            success: function (object) {
                                observer.onNext(object);
                                observer.onCompleted();
                            },
                            error: function (gameScore, error) {
                                console.log("Parse Error: on collection:" + collection);
                                console.log("Parse Error: " + error.code + " " + error.message);
                                if (error.code == 209) {
                                    Parse.User.logOut();
                                }
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },
                update: function (collection, object, params) {
                    var id = object.id;
                    var object = updateFields(object, params);
                    if (params.acl) {
                        var acl = buildACL(params);
                        object.setACL(acl);
                    }

                    return Rx.Observable.create(function (observer) {
                        object.save(null, {
                            success: function (updated) {
                                observer.onNext(updated);
                                observer.onCompleted();
                            },
                            error: function (updated, error) {
                                console.log("Parse Error: on collection:" + collection);
                                console.log("Parse Error: " + error.code + " " + error.message);
                                if (error.code == 209) {
                                    Parse.User.logOut();
                                }
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    })
                },
                delete: function (collection, object) {
                    return Rx.Observable.create(function (observer) {
                        object.destroy({
                            success: function (object) {
                                observer.onNext(object);
                                observer.onCompleted();
                            },
                            error: function (object, error) {
                                console.log("Parse Error: on collection:" + collection);
                                console.log("Parse Error: " + error.code + " " + error.message);
                                if (error.code == 209) {
                                    Parse.User.logOut();
                                }
                                observer.onError(error);
                            }
                        });

                        return function () {
                        }
                    });
                }
            }
        };
    });

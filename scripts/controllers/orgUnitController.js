/**
 * Created by Heshan on 12/30/2015.
 */
app.controller('orgUnitController', function ($scope, $rootScope, $filter, $http, $q) {
    lastDay = $filter('date')(lastDay, 'yyyy-MM-dd');
    lastWeek = $filter('date')(lastWeek, 'yyyy-MM-dd');
    lastMonth = $filter('date')(lastMonth, 'yyyy-MM-dd');

    var date = "";


    $scope.ORGGroup = []; // ngmodel for org unit group filter
    $scope.orgUnitGroupSets = []; // holds all orgunit Groupsets

    $http.get(apiUrl).then(function (response) {
        if (!response.data == "")
            $rootScope.setting = JSON.parse(response.data.value);

    });

    //load dropdown list for group set
    var orgUnitGroupSet = "../../organisationUnitGroupSets.json?fields=[id,name]&paging=false";
    $http.get(orgUnitGroupSet).then(function (response) {
        if (!response.data == "")
            $scope.orgUnitGroupSets = response.data.organisationUnitGroupSets;

    });

    var organisationUnitGroups = "../../organisationUnitGroups.json?fields=[id,name,organisationUnitGroupSet]&paging=false";
    $http.get(organisationUnitGroups).then(function (response) {
        if (!response.data == "")

            console.log(response);
        console.log(response.data.organisationUnitGroups);

        $scope.ORGGroups = response.data.organisationUnitGroups;
        //$scope.ORGGroup = $scope.ORGGroups

    });

    var insarray = [];
    $http.get(apiUrl).then(function (response) {
        if (!response.data == "") {
            insarray = JSON.parse(response.data.value);
        }
    });


    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };
    $scope.select = [];
    $scope.select.org = [];
    $scope.select.orgins = [];
    $scope.select = {};
    $scope.orgid = {};
    $scope.sel = {};


    //var orgUnitUrl = "../../organisationUnits.json?fields=[code,id,name,created,lastUpdated,externalAccess,shortName,uuid,parent,path,openingDate,attributeValues]&paging=false";
    //var orgUnitUrl = "../../organisationUnits.json?fields=code,id,name,created,lastUpdated,externalAccess,shortName,uuid,parent,path,openingDate,closedDate,attributeValues,phoneNumber,address,email,contactPerson,organisationUnitGroups[id]&paging=false";
    var orgUnitUrl = "../../organisationUnits.json?fields=:all&paging=false";
    var orgUnitGroupUrl = "../../organisationUnitGroups.json?fields=:all&paging=false";
    var orgUnitGroupSetUrl = "../../organisationUnitGroupSets.json?fields=:all&paging=false";

    var orgUnitJson;
    var orgUnitGroupJson;
    var orgUnitGroupSetJson;
    var check = 0;
    var filData = [];
    var selData = [];

    var orgGroup;
    var filDateSelected = false;
    var noDurationSelected = false;

    $scope.json = function () {
        if (check == 0) {
            $scope.loading = true;
            var a = $http.get(orgUnitUrl).then(function (response) {
                if (!response.data == "")

                    orgUnitJson = response.data;

            });

            var b = $http.get(orgUnitGroupUrl).then(function (response) {
                if (!response.data == "")

                    orgUnitGroupJson = response.data;

            });

            var c = $http.get(orgUnitGroupSetUrl).then(function (response) {
                if (!response.data == "")

                    orgUnitGroupSetJson = response.data;

            });

            var g;
            if (typeof attributeJson === 'undefined') {
                g = $http.get(attributeUrl).then(function (response) {
                    if (!response.data == "")

                        attributeJson = (response.data);

                });

            }

            $q.all([a,b,c,g]).then(function (result) {
                check++;
                $scope.loading = false;
                if (orgGroup == undefined) {
                    $scope.getJson(orgUnitJson);
                }
                else {
                    var orgJson =
                    {
                        organisationUnits: []
                    };
                    $http.get("../../organisationUnitGroups/" + orgGroup + ".json?fields=[organisationUnits]&paging=false").then(function (response) {
                        var orgUnits = response.data.organisationUnits;

                        for (var a = 0; a < orgUnits.length; a++) {
                            for (var b = 0; b < orgUnitJson.organisationUnits.length; b++) {
                                if (orgUnits[a].id == orgUnitJson.organisationUnits[b].id) {
                                    orgJson.organisationUnits.push(orgUnitJson.organisationUnits[b]);
                                }
                            }

                        }
                        $scope.getJson(orgJson);

                    });
                }
            });
        }
        else {
            if (orgGroup == undefined) {
                $scope.getJson(orgUnitJson);
            }
            else {
                var orgJson =
                {
                    organisationUnits: []
                };
                $http.get("../../organisationUnitGroups/" + orgGroup + ".json?fields=[organisationUnits]&paging=false").then(function (response) {
                    var orgUnits = response.data.organisationUnits;

                    for (var a = 0; a < orgUnits.length; a++) {
                        for (var b = 0; b < orgUnitJson.organisationUnits.length; b++) {
                            if (orgUnits[a].id == orgUnitJson.organisationUnits[b].id) {
                                orgJson.organisationUnits.push(orgUnitJson.organisationUnits[b]);
                            }
                        }

                    }
                    $scope.getJson(orgJson);

                });
            }
        }
    };

    var orgU = [];
    var metaData;

    $scope.getJson = function (orgUnitJson) {
        var orgUnitIDs = "";
        metaData =
        {
            attributes: [],
            organisationUnits: [],
            organisationUnitGroups: [],
            organisationUnitGroupSets: []

        };

        if (noDurationSelected && orgGroup === undefined) {

            metaData.organisationUnits = (orgUnitJson.organisationUnits);
            $scope.organisationUnits = metaData.organisationUnits;
        }

        else {

            for (var i = 0; i < orgUnitJson.organisationUnits.length; i++) {
                if (orgUnitJson.organisationUnits[i].lastUpdated > date) {
                    orgU.push(orgUnitJson.organisationUnits[i].id);
                    orgUnitIDs += orgUnitJson.organisationUnits[i].id + ",";
                    metaData.organisationUnits.push(orgUnitJson.organisationUnits[i]);
                }
            }
            $scope.organisationUnits = metaData.organisationUnits;
        }
//
        angular.forEach(metaData.organisationUnits, function (item, key) {
            $scope.select[item.id] = $scope.select[item.id] || {};

            angular.forEach(insarray.instances, function (index, key) {
                $scope.select[item.id][index.id] = false;
            });
        });
//


        angular.forEach(insarray.instances, function (item, key) {

            filData[key] = {
                attributes: [],
                organisationUnits: [],
                organisationUnitGroups: [],
                organisationUnitGroupSets: []
            };
            selData[key] = {
                attributes: [],
                organisationUnits: [],
                organisationUnitGroups: [],
                organisationUnitGroupSets: []
            };

        });
    };


    $scope.filter = [{
        id: '1',
        name: 'Last Day'
    }, {
        id: '2',
        name: 'Last Week'
    }, {
        id: '3',
        name: 'Last Month'

    },
        {
            id: '4',
            name: 'No-Specific Duration'
        }
    ];


    $scope.getdate = function (filter) {

        if (filter.id == 1) {
            filDateSelected = true;
            noDurationSelected = false;

            date = lastDay;
            $scope.json();
        }
        if (filter.id == 2) {
            filDateSelected = true;
            noDurationSelected = false;
            date = lastWeek;
            $scope.json();
        }
        if (filter.id == 3) {
            filDateSelected = true;
            noDurationSelected = false;

            date = lastMonth;
            $scope.json();
        }

        if (filter.id == 4) {
            filDateSelected = true;
            noDurationSelected = true;

            date = noDuration;

            $scope.json();
        }
    };

    $scope.getAllGroupsByGroupsetId = function (orgUnitGroupsetId) {

        if ($scope.ORGGroup.length > 0)
            $scope.ORGGroup.length = 0;

        angular.forEach($scope.ORGGroups, function (item, key) {
            if (item.organisationUnitGroupSet !== undefined && item.organisationUnitGroupSet.id == orgUnitGroupsetId) {
                $scope.ORGGroup.push(item);
            }
        });

    };

    $scope.getGroup = function (group) {

        orgGroup = group;
        $scope.json();

    };

    var userUrl;
    var natUserUrl = "../../me.json";
    var indexes = [];
    $scope.x = function () {
        window.location.reload();


    };

    $scope.checkAll2 = function () {


        angular.forEach(metaData.organisationUnits, function (item) {
            $scope.orgid[item.id] = $scope.selectedAll;
        });

    };

    $scope.checkAll = function (instance) {

        angular.forEach(metaData.organisationUnits, function (index, key) {
            $scope.select[index.id][instance] = $scope.sel[instance];

        });

    };

    $scope.syncAll = function () {
        var x1 = false;
        angular.forEach(insarray.instances, function (item, key) {
            indexes[key] = 0;
            filData[key] = {
                attributes: [],
                organisationUnits: [],
                organisationUnitGroups: [],
                organisationUnitGroupSets: []
            };
            selData[key] = {
                attributes: [],
                organisationUnits: [],
                organisationUnitGroups: [],
                organisationUnitGroupSets: []
            };

        });
        var x = 0;
        var i = 0;
        angular.forEach(metaData.organisationUnits, function (item, key) {
            if ($scope.orgid[item.id]) {


                var dataaa = metaData.organisationUnits[key];
                x++;
                angular.forEach(insarray.instances, function (instance, key) {
                    if ($scope.select[item.id][instance.id]) {
                        filData[key].organisationUnits[indexes[key]] = dataaa;
                        selData[key].organisationUnits[indexes[key]] = dataaa;


                        indexes[key]++;
                        i++;
                        x1 = true;

                    }

                });


            }

        });

        if (x1 == false) {
            $('#share_list_popup').html(" ");
            $("#myModalLabel").html("Sorry Unable to Sync !!!");
            $('#share_list_popup').append('Please Check whether you have Mapped MetaData With Instance.');
            $("#alertModal").modal("show");
        }
        else if (x1 == true) {


            angular.forEach(insarray.instances, function (instance, key) {


                var instanceURL = instance.url + "/api/metaData";
                if (filData[key].organisationUnits.length > 0) {


                    for (var ind = 0; ind < filData[key].organisationUnits.length; ind++) {
                        if (filData[key].organisationUnits[ind].attributeValues) {
                            for (var ind2 = 0; ind2 < filData[key].organisationUnits[ind].attributeValues.length; ind2++) {


                                for (var val = 0; val < attributeJson.attributes.length; val++) {
                                    if (attributeJson.attributes[val].id == filData[key].organisationUnits[ind].attributeValues[ind2].attribute.id) {
                                        var result = $.grep(filData[key].attributes, function (e) {
                                            return e.id === attributeJson.attributes[val].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].attributes.push(attributeJson.attributes[val]);
                                        }
                                        break;
                                    }

                                }
                            }
                        }
                    }

                    for (var ind = 0; ind < filData[key].organisationUnits.length; ind++) {
                        if (filData[key].organisationUnits[ind].organisationUnitGroups) {
                            for (var ind2 = 0; ind2 < filData[key].organisationUnits[ind].organisationUnitGroups.length; ind2++) {
                                for (var val = 0; val < orgUnitGroupJson.organisationUnitGroups.length; val++) {
                                    if (orgUnitGroupJson.organisationUnitGroups[val].id == filData[key].organisationUnits[ind].organisationUnitGroups[ind2].id) {
                                        var result = $.grep(filData[key].organisationUnitGroups, function (e) {
                                            return e.id === orgUnitGroupJson.organisationUnitGroups[val].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].organisationUnitGroups.push(orgUnitGroupJson.organisationUnitGroups[val]);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    for (var ind = 0; ind < filData[key].organisationUnitGroups.length; ind++) {
                        if (filData[key].organisationUnitGroups[ind].organisationUnitGroupSets) {
                            for (var ind2 = 0; ind2 < filData[key].organisationUnitGroups[ind].organisationUnitGroupSets.length; ind2++) {
                                for (var val = 0; val < orgUnitGroupSetJson.organisationUnitGroupSets.length; val++) {
                                    if (filData[key].organisationUnitGroups[ind].organisationUnitGroupSets[ind2].id == orgUnitGroupSetJson.organisationUnitGroupSets[val].id) {
                                        var result = $.grep(filData[key].organisationUnitGroupSets, function (e) {
                                            return e.id === orgUnitGroupSetJson.organisationUnitGroupSets[val].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].organisationUnitGroupSets.push(orgUnitGroupSetJson.organisationUnitGroupSets[val]);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    for (var a = 0; a < filData[key].organisationUnits.length; a++) {
                        for (var b = 0; b < orgUnitJson.organisationUnits.length; b++) {
                            if (filData[key].organisationUnits[a].parent && filData[key].organisationUnits[a].parent.id == orgUnitJson.organisationUnits[b].id) {

                                var result = $.grep(filData[key].organisationUnits, function (e) {
                                    return e.id === orgUnitJson.organisationUnits[b].id;
                                });
                                if (result.length == 0) {
                                    filData[key].organisationUnits.push(orgUnitJson.organisationUnits[b]);
                                }


                                break;
                            }
                        }
                    }


                    var v = (filData[key]);
                    console.log(v);

                    $("#coverLoad").show();

                    var header = {

                        "Authorization": "Basic " + btoa(instance.uname + ':' + instance.pword),
                        "Content-Type": 'application/json'

                    };
                    var x = $http({
                        method: 'POST',
                        url: instanceURL,
                        data: v,
                        headers: header
                    })

                        .success(function (response) {
                            $().toastmessage('showSuccessToast', 'Objects Successfully Imported <br /> Instance : ' + instance.name + '<br /> Updated Count : ' + response.importCount.updated + ' <br />Imported Count : ' + response.importCount.imported);
                            userUrl = instance.url + "/api/me.json";

                            //alert("objects Successfully Imported");
                            saveSync(response.importTypeSummaries, filData[key], instance, response, selData[key]);

                        })
                        .error(function (response) {
                            $().toastmessage('showErrorToast', 'Make Sure Whether the Instance <br/>' + instance.name + ' is Connected . ');
                            saveSync("error", filData[key], instance, "error");
                            $("#coverLoad").hide();
                        });

                    $q.all([x]).then(function (result) {
                        $("#coverLoad").hide();

                    });
                }
            });
        }
        else {
            $('#share_list_popup').html(" ");
            $("#myModalLabel").html("Error");
            $('#share_list_popup').append('Complete Mapping and then Synchronize');
            $("#alertModal").modal("show");

        }


    };
    var syncedDate;
    var t = 0;
    var proUserID;

    function saveSync(respo, filData, instance, res, selData) {

        var m = 0;

        var k = $http.get("../../system/info").then(function (response) {
            response = response.data;
            syncedDate = response.serverDate.split("T")[0] + " (" + response.serverDate.split("T")[1].split(".")[0] + ")";

        });
        $q.all([k]).then(function () {

            if (respo == "error") {
                t = 2;
            }
            else {
                for (var k = 0; k < respo.length; k++) {

                    if (respo[k].status == "SUCCESS") {

                        t = 0;
                    }
                    else {
                        m++;
                    }

                }
                if (m != 0) {
                    t = 1;
                }
            }
            saveNotification($http, $rootScope, t, instance, filData, respo, selData);
            saveHistory($http, $rootScope, t, instance, filData, respo, selData);
            if (res != "error") {
                msgSummary($http, $rootScope, filData, res, instance, respo, selData);
            }
        });

    }

    function saveNotification($http, $rootScope, t, instance, fildata, respo, selData) {
        var notifications = {};
        var newNotification = {};

        if (t == 0) {
            newNotification.notification = "All the MetaData Updates Were Successful";
            newNotification.instance = instance.name;
            newNotification.metaDataFilterd = fildata;
            newNotification.selectedMetaData = selData;
            newNotification.response = respo;
        }
        if (t == 1) {
            newNotification.notification = "Some of the MetaData field Updates Were Successful";
            newNotification.instance = instance.name;
            newNotification.metaDataFilterd = fildata;
            newNotification.selectedMetaData = selData;
            newNotification.response = respo;
        }

        if (t == 2) {
            newNotification.notification = "Error In Network";
            newNotification.instance = instance.name;
            newNotification.metaDataFilterd = fildata;
            newNotification.selectedMetaData = selData;
            newNotification.response = respo;
        }

        var notifyJSON = "";


        newNotification.date = syncedDate;

        $http.get(syncNotificationUrl).then(function (res) {

            if (res.data == "\"x\"") {
                notifications.data = [];
            }
            else if (res.data != "") {
                notifications = res.data;

            }
            else {
                notifications.data = [];
            }
            notifications.data.push(newNotification);
            notifyJSON = JSON.stringify(notifications);

            postNotification($http, $rootScope, notifyJSON);

        });
    }

    function saveHistory($http, $rootScope, t, instance, fildata, respo, selData) {
        var history = {};
        var newHistory = {};
        if (t == 0) {
            newHistory.notification = "All the MetaData Updates Were Successful";
            newHistory.instance = instance.name;
            newHistory.metaDataFilterd = fildata;
            newHistory.response = respo;
            newHistory.selectedMetaData = selData;
        }
        if (t == 1) {
            newHistory.notification = "Some of the MetaData field Updates Were Successful";
            newHistory.instance = instance.name;
            newHistory.metaDataFilterd = fildata;
            newHistory.response = respo;
            newHistory.selectedMetaData = selData;
        }

        if (t == 2) {
            newHistory.notification = "Error In Network";
            newHistory.instance = instance.name;
            newHistory.metaDataFilterd = fildata;
            newHistory.response = respo;
            newHistory.selectedMetaData = selData;
        }

        var historyJSON = "";
        newHistory.date = syncedDate;

        $http.get(syncHistoryUrl).then(function (res) {

            if (res.data == "\"x\"") {
                history.data = [];
            }
            else if (res.data != "") {
                history = res.data;

            }
            else {
                history.data = [];
            }
            history.data.push(newHistory);
            historyJSON = JSON.stringify(history);

            postHistory($http, $rootScope, historyJSON);
        });
    }


    function postHistory($http, $rootScope, historyJSON) {
        $http.post(syncHistoryUrl, historyJSON, {headers: {'Content-Type': 'text/plain;charset=utf-8'}});
    }

    function postNotification($http, $rootScope, notifyJSON) {
        $http.post(syncNotificationUrl, notifyJSON, {headers: {'Content-Type': 'text/plain;charset=utf-8'}});

    }

    var natUserID;

    function msgSummary($http, $rootScope, filData, response, instance, respo, selData) {
        //var er = syncSummary.stats.errors;

        var im = response.importCount.imported;
        var de = response.importCount.deleted;
        var up = response.importCount.updated;
        var ig = response.importCount.ignored;
        var ins = instance.name;

        var syd = syncedDate;

        var allSyncData = "";
        var subject = "DHIS MetaData Sync Summary";

        var msg = ins + " was synced with the National Instance on " + syd + ". Here are the statistics of the import. \n";

        for (var j = 0; j < respo.length; j++) {
            if (respo[j].status == "SUCCESS" && respo[j].type == "OrganisationUnit") {

                allSyncData += '\n Organisation Units-:\n ';

                for (var k = 0; k < filData.organisationUnits.length; k++) {
                    var count = 0;
                    for (var x = 0; x < selData.organisationUnits.length; x++) {

                        if (selData.organisationUnits[x].id == filData.organisationUnits[k].id) {
                            allSyncData += filData.organisationUnits[k].name + '(Selected)\n';
                            count++;
                            break;
                        }
                    }
                    if (count == 0) {
                        allSyncData += filData.organisationUnits[k].name + '(Parent)\n';
                    }

                }
            }

            if (respo[j].status == "SUCCESS" && respo[j].type == "Attribute") {

                allSyncData += '\n Attributes-:\n ';

                for (var k = 0; k < filData.attributes.length; k++) {

                    allSyncData += filData.attributes[k].name + "\n";

                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "OrganisationUnitGroup") {

                allSyncData += '\n Organisation Unit Groups\n ';

                for (var k = 0; k < filData.organisationUnitGroups.length; k++) {

                    allSyncData += filData.organisationUnitGroups[k].name + "\n";

                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "OrganisationUnitGroupSet") {

                allSyncData += '\n Organisation Unit Group Sets\n ';

                for (var k = 0; k < filData.organisationUnitGroupSets.length; k++) {

                    allSyncData += filData.organisationUnitGroupSets[k].name + "\n";

                }
            }
        }


        msg += "\n Imported Count : " + im;
        msg += "\n Deleted Count : " + de;
        msg += "\n Updated Count : " + up;
        msg += "\n Ignored Count : " + ig;
        msg += "\n Updated Meta Data are as Follows-:" + allSyncData;

        var header = {

            "Authorization": "Basic " + btoa(instance.uname + ':' + instance.pword)

        };

        var z = $http({method: 'get', url: instance.url + "/api/me.json", headers: header})
            .success(function (data) {

                proUserID = data.id;
            })
            .error(function (data) {

            });
        var y = $http.get(natUserUrl).then(function (response) {
            if (!response.data == "")

                natUserID = response.data.id;
        });

        $q.all([y, z]).then(function () {

            var jsonData1 = {
                "subject": subject,
                "text": msg,
                "users": [{id: natUserID}]
            };
            var jsonData2 = {
                "subject": subject,
                "text": msg,
                "users": [{id: proUserID}]
            };


            $http({
                method: 'POST',
                url: '../../messageConversations',
                data: jsonData1,
                headers: {"Content-Type": 'application/json'}
            })
                .success(function (response) {

                })
                .error(function (response) {

                });

            var header = {

                "Authorization": "Basic " + btoa(instance.uname + ':' + instance.pword),
                "Content-Type": 'application/json'

            };
            $http({
                method: 'POST',
                url: instance.url + '/api/messageConversations',
                data: jsonData2,
                headers: header
            })
                .success(function (response) {

                })
                .error(function (response) {

                });
        });


    }


})
;
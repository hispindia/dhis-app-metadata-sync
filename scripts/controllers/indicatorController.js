/**
 * Created by Heshan on 1/4/2016.
 */
app.controller('indicatorController', function ($scope, $rootScope, $filter, $http, $q) {
    lastDay = $filter('date')(lastDay, 'yyyy-MM-dd');
    lastWeek = $filter('date')(lastWeek, 'yyyy-MM-dd');
    lastMonth = $filter('date')(lastMonth, 'yyyy-MM-dd');
    noDuration = $filter('date')(noDuration, 'yyyy-MM-dd');
    var date = "";

    var indicatorGroupUrl = "../../indicatorGroups.json?fields=[id,name]&paging=false";
    $http.get(apiUrl).then(function (response) {
        if (!response.data == "")
            $rootScope.setting = JSON.parse(response.data.value);

    });

//load indicator to dropdown
    $http.get(indicatorGroupUrl).then(function (response) {
        if (!response.data == "")
            $scope.INGroup = response.data.indicatorGroups;

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
    $scope.select.ind = [];
    $scope.select.indins = [];
	$scope.select = {};
    $scope.indid = {};
    $scope.sel = {};


    var indicatorUrl = "../../indicators.json?fields=[:all]&paging=false";
    var indicatorType = "../../indicatorTypes.json?fields=[:all]&paging=false";
    var indicatorGroupSetUrl = "../../indicatorGroupSets.json?fields=[:all]&paging=false";
    var indicatorGroup = "../../indicatorGroups.json?fields=[:all]&paging=false";
    var categoryOptionComboUrl = "../../categoryOptionCombos.json?fields=[:all]&paging=false";

    var categoryComboUrl = "../../categoryCombos.json?fields=[:all]&paging=false";
    var categoryUrl = "../../categories.json?fields=[:all]&paging=false";
    var categoryOptionUrl = "../../categoryOptions.json?fields=[:all]&paging=false";

    var indicatorJson;
    var indicatorTypeJson;
    var categoryOptionComboJson;

    var categoryComboJson;
    var categoryJson;
    var categoryOptionJson;

    var indicatorGroupSetJson;
    var indicatorGroupJson;
    var check = 0;
    var filData = [];
    var selData = [];

    //variable to keep the selected indicated group
    var indGroup;
    //check whether filter by period selected
    var filDateSelected = false;
    //check whether no limit in the period
    var noDurationSelected = false;

    $scope.json = function () {
        if (check == 0 && filDateSelected) {
            $scope.loading = true;
            var a;
            if (indicatorJson == undefined) {
                a = $http.get(indicatorUrl).then(function (response) {
                    if (!response.data == "")
                    indicatorJson = response.data;

                });
            }

            var b = $http.get(indicatorType).then(function (response) {
                if (!response.data == "")
                indicatorTypeJson = response.data;

            });
            var c = $http.get(indicatorGroup).then(function (response) {
                if (!response.data == "")
                indicatorGroupJson = response.data;

            });
            var d = $http.get(categoryOptionComboUrl).then(function (response) {
                if (!response.data == "")
                categoryOptionComboJson = response.data;

            });
            var e;
            if (dataElementJson == undefined) {
                e = $http.get(DataElementUrl).then(function (response) {
                    if (!response.data == "")
                    dataElementJson = response.data;

                });
            }

            var f;
            if (attributeJson == undefined) {
                f = $http.get(attributeUrl).then(function (response) {
                    if (!response.data == "")
                    attributeJson = (response.data);

                });
            }
            var g = $http.get(indicatorGroupSetUrl).then(function (response) {
                if (!response.data == "")
                indicatorGroupSetJson = response.data;

            });
            var h;
            if (categoryComboJson == undefined) {
                h = $http.get(categoryComboUrl).then(function (response) {
                    if (!response.data == "")
                        categoryComboJson = (response.data);

                });
            }
            var i;
            if (categoryOptionJson == undefined) {
                i = $http.get(categoryOptionUrl).then(function (response) {
                    if (!response.data == "")
                        categoryOptionJson = (response.data);

                });
            }
            var j;
            if (categoryJson == undefined) {
                j = $http.get(categoryUrl).then(function (response) {
                    if (!response.data == "")
                        categoryJson = (response.data);

                });
            }

            $q.all([a, b, c, d, e, f, g, h, i, j]).then(function (result) {
                check++;
                $scope.loading = false;
                if (indGroup == undefined) {
                    $scope.getJson(indicatorJson);
                }
                else {
                    var indJson =
                    {
                        indicators: []
                    };
                    $http.get("../../indicatorGroups/" + indGroup + ".json?fields=[indicators]&paging=false").then(function (response) {
                        var indicatrs = response.data.indicators;

                        for (var a = 0; a < indicatrs.length; a++) {
                            for (var b = 0; b < indicatorJson.indicators.length; b++) {
                                if (indicatrs[a].id == indicatorJson.indicators[b].id) {
                                    //DEString += indicatrs[a].id + ",";
                                    indJson.indicators.push(indicatorJson.indicators[b]);
                                }
                            }

                        }
                        $scope.getJson(indJson);

                    });
                }
            });
        }
        else if (filDateSelected) {
            if (indGroup == undefined) {
                $scope.getJson(indicatorJson);
            }
            else {
                var indJson =
                {
                    indicators: []
                };
                $http.get("../../indicatorGroups/" + indGroup + ".json?fields=[indicators]&paging=false").then(function (response) {
                    var indicatrs = response.data.indicators;

                    for (var a = 0; a < indicatrs.length; a++) {
                        for (var b = 0; b < indicatorJson.indicators.length; b++) {
                            if (indicatrs[a].id == indicatorJson.indicators[b].id) {
                                //DEString += indicatrs[a].id + ",";
                                indJson.indicators.push(indicatorJson.indicators[b]);
                            }
                        }

                    }
                    $scope.getJson(indJson);

                });
            }
        }
    };


    var metaData;
    $scope.getJson = function (indicatorJson) {
        var indicatorIDs = "";
        metaData =
        {
            attributes: [],
            indicators: [],
            indicatorTypes: [],
            indicatorGroupSets: [],
            indicatorGroups: [],
            categoryOptionCombos: [],
            categoryCombos: [],
            categories: [],
            categoryOptions: [],
            dataElements: []


        };


        if (noDurationSelected && indGroup === undefined) {


            metaData.indicators = (indicatorJson.indicators);

            $scope.indicators = metaData.indicators;


        }
        else {
            for (var i = 0; i < indicatorJson.indicators.length; i++) {
                if (indicatorJson.indicators[i].lastUpdated > date) {

                    indicatorIDs += indicatorJson.indicators[i].id + ",";
                    metaData.indicators.push(indicatorJson.indicators[i]);

                }
            }
            $scope.indicators = metaData.indicators;
        }
//
	angular.forEach(metaData.indicators, function (item, key) {
    $scope.select[item.id] = $scope.select[item.id] || {};

    angular.forEach(insarray.instances, function (index, key) {
        $scope.select[item.id][index.id] = false;
    });
});
//
        angular.forEach(insarray.instances, function (item, key) {

            filData[key] = {
                attributes: [],
                indicators: [],
                indicatorTypes: [],
                indicatorGroupSets: [],
                indicatorGroups: [],
                categoryOptionCombos: [],
                categoryCombos: [],
                categories: [],
                categoryOptions: [],
                dataElements: []
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


    $scope.getGroup = function (group) {
        indGroup = group;
        $scope.json();

    };

    var userUrl;
    var natUserUrl = "../../me.json";
    var indexes = [];
    $scope.x = function () {
        window.location.reload();


    };
    $scope.checkAll2 = function () {

        angular.forEach(metaData.indicators, function (item) {
            $scope.indid[item.id] = $scope.selectedAll;
        });

    };
	 $scope.checkAll=function(instance){
		
        angular.forEach(metaData.indicators, function (index, key) {
            $scope.select[index.id][instance]=  $scope.sel[instance];

        });

    };


    $scope.syncAll = function () {
        var x1 = false;
        angular.forEach(insarray.instances, function (item, key) {
            indexes[key] = 0;
            filData[key] = {
                attributes: [],
                indicators: [],
                indicatorTypes: [],
                indicatorGroupSets: [],
                indicatorGroups: [],
                categoryOptionCombos: [],
                categoryCombos: [],
                categories: [],
                categoryOptions: [],
                dataElements: []
            };

        });
        var x = 0;
        var i = 0;
        angular.forEach(metaData.indicators, function (item, key) {
            if ($scope.indid[item.id]) {
                var dataaa = metaData.indicators[key];
                x++;
                angular.forEach(insarray.instances, function (instance, key) {
                    if (  $scope.select[item.id][instance.id]) {
                        filData[key].indicators[indexes[key]] = dataaa;
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
                if (filData[key].indicators.length > 0) {
                    for (var ind = 0; ind < filData[key].indicators.length; ind++) {
                        if (filData[key].indicators[ind].attributeValues) {
                            for (var ind2 = 0; ind2 < filData[key].indicators[ind].attributeValues.length; ind2++) {
                                for (var val = 0; val < attributeJson.attributes.length; val++) {
                                    if (attributeJson.attributes[val].id == filData[key].indicators[ind].attributeValues[ind2].attribute.id) {
                                        var result = $.grep(filData[key].attributes, function (e) {
                                            return e.id === attributeJson.attributes[val].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].attributes.push(attributeJson.attributes[val]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (var a = 0; a < filData[key].indicators.length; a++) {
                        for (var b = 0; b < indicatorTypeJson.indicatorTypes.length; b++) {
                            if (filData[key].indicators[a].indicatorType && filData[key].indicators[a].indicatorType.id == indicatorTypeJson.indicatorTypes[b].id) {
                                var result = $.grep(filData[key].indicatorTypes, function (e) {
                                    return e.id === indicatorTypeJson.indicatorTypes[b].id;
                                });
                                if (result.length == 0) {
                                    filData[key].indicatorTypes.push(indicatorTypeJson.indicatorTypes[b]);
                                }
                                break;
                            }
                        }
                    }
                    for (var m = 0; m < filData[key].indicators.length; m++) {
                        for (var n = 0; n < indicatorGroupJson.indicatorGroups.length; n++) {
                            for (var o = 0; o < filData[key].indicators[m].indicatorGroups.length; o++) {
                                if (filData[key].indicators[m].indicatorGroups && filData[key].indicators[m].indicatorGroups[o].id == indicatorGroupJson.indicatorGroups[n].id) {
                                    var result = $.grep(filData[key].indicatorGroups, function (e) {
                                        return e.id === indicatorGroupJson.indicatorGroups[n].id;
                                    });
                                    if (result.length == 0) {
                                        filData[key].indicatorGroups.push(indicatorGroupJson.indicatorGroups[n]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    for(var m = 0; m < filData[key].indicatorGroups.length; m++) {
                        if(filData[key].indicatorGroups[m].indicatorGroupSet){
                            for (var n = 0; n < indicatorGroupSetJson.indicatorGroupSets.length; n++) {
                                if (filData[key].indicatorGroups[m].indicatorGroupSet.id == indicatorGroupSetJson.indicatorGroupSets[n].id){
                                    var result = $.grep(filData[key].indicatorGroupSets, function (e) {
                                        return e.id === indicatorGroupSetJson.indicatorGroupSets[n].id;
                                    });
                                    if (result.length == 0) {
                                        filData[key].indicatorGroupSets.push(indicatorGroupSetJson.indicatorGroupSets[n]);
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    var str;
                    var str1;
                    var str2;
                    var de;
                    var coc;
                    for (var a = 0; a < filData[key].indicators.length; a++) {

                        if (filData[key].indicators[a].denominator) {
                            str1 = filData[key].indicators[a].denominator;
                            var found1 = [],          // an array to collect the strings that are found
                                rxp1 = /{([^}]+)}/g,
                                str1,
                                curMatch1;

                            while (curMatch1 = rxp1.exec(str1)) {
                                found1.push(curMatch1[1]);
                            }

                            for (var k = 0; k < found1.length; k++) {
                                str = found1[k];
                                de = str.split(".")[0];
                                coc = str.split(".")[1];

                                for (var c = 0; c < dataElementJson.dataElements.length; c++) {
                                    if (de == dataElementJson.dataElements[c].id) {
                                        var result = $.grep(filData[key].dataElements, function (e) {
                                            return e.id === dataElementJson.dataElements[c].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].dataElements.push(dataElementJson.dataElements[c]);
                                        }
                                    }
                                }
/*
                                for (var c = 0; c < categoryOptionComboJson.categoryOptionCombos.length; c++) {
                                    if (coc == categoryOptionComboJson.categoryOptionCombos[c].id) {
                                        var result = $.grep(filData[key].categoryOptionCombos, function (e) {
                                            return e.id === categoryOptionComboJson.categoryOptionCombos[c].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].categoryOptionCombos.push(categoryOptionComboJson.categoryOptionCombos[c]);
                                        }
                                    }
                                }
*/
                            }
                        }

                        if (filData[key].indicators[a].numerator) {
                            str2 = filData[key].indicators[a].numerator;
                            var found2 = [],          // an array to collect the strings that are found
                                rxp2 = /{([^}]+)}/g,
                                str2,
                                curMatch2;

                            while (curMatch2 = rxp2.exec(str2)) {
                                found2.push(curMatch2[1]);
                            }

                            for (var k = 0; k < found2.length; k++) {
                                str = found2[k];
                                de = str.split(".")[0];
                                coc = str.split(".")[1];

                                for (var c = 0; c < dataElementJson.dataElements.length; c++) {
                                    if (de == dataElementJson.dataElements[c].id) {
                                        var result = $.grep(filData[key].dataElements, function (e) {
                                            return e.id === dataElementJson.dataElements[c].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].dataElements.push(dataElementJson.dataElements[c]);
                                        }
                                    }
                                }
/*
                                for (var c = 0; c < categoryOptionComboJson.categoryOptionCombos.length; c++) {
                                    if (coc == categoryOptionComboJson.categoryOptionCombos[c].id) {
                                        var result = $.grep(filData[key].categoryOptionCombos, function (e) {
                                            return e.id === categoryOptionComboJson.categoryOptionCombos[c].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].categoryOptionCombos.push(categoryOptionComboJson.categoryOptionCombos[c]);
                                        }
                                    }
                                }
*/
                            }
                        }

                    }

                    if(filData[key].dataElements){
                        for (var a = 0; a < filData[key].dataElements.length; a++) {
                            if(filData[key].dataElements[a].categoryCombo.name != "default"){
                                for (var b = 0; b < categoryComboJson.categoryCombos.length; b++) {
                                    if (filData[key].dataElements[a].categoryCombo.id == categoryComboJson.categoryCombos[b].id) {
                                        var result = $.grep(filData[key].categoryCombos, function (e) {
                                            return e.id === categoryComboJson.categoryCombos[b].id;
                                        });
                                        if (result.length == 0) {
                                            filData[key].categoryCombos.push(categoryComboJson.categoryCombos[b]);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    for(var a=0; a < filData[key].categoryCombos.length; a++){
                        if(filData[key].categoryCombos[a].categories) {
                            for (var b = 0; b < filData[key].categoryCombos[a].categories.length; b++) {
                                if (filData[key].categoryCombos[a].categories[b].name != "default") {
                                    for (var c = 0; c < categoryJson.categories.length; c++) {
                                        if (filData[key].categoryCombos[a].categories[b].id == categoryJson.categories[c].id) {
                                            var result = $.grep(filData[key].categories, function (e) {
                                                return e.id === categoryJson.categories[c].id;
                                            });
                                            if (result.length == 0) {
                                                filData[key].categories.push(categoryJson.categories[c]);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        if(filData[key].categoryCombos[a].categoryOptionCombos) {
                            for (var b = 0; b < filData[key].categoryCombos[a].categoryOptionCombos.length; b++) {
                                if (filData[key].categoryCombos[a].categoryOptionCombos[b].name != "default") {
                                    for (var c = 0; c < categoryOptionComboJson.categoryOptionCombos.length; c++) {
                                        if (filData[key].categoryCombos[a].categoryOptionCombos[b].id == categoryOptionComboJson.categoryOptionCombos[c].id) {
                                            var result = $.grep(filData[key].categoryOptionCombos, function (e) {
                                                return e.id === categoryOptionComboJson.categoryOptionCombos[c].id;
                                            });
                                            if (result.length == 0) {
                                                filData[key].categoryOptionCombos.push(categoryOptionComboJson.categoryOptionCombos[c]);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for(var a=0; a < filData[key].categories.length; a++){
                        if(filData[key].categories[a].categoryOptions) {
                            for (var b = 0; b < filData[key].categories[a].categoryOptions.length; b++) {
                                if (filData[key].categories[a].categoryOptions[b].name != "default") {
                                    for (var c = 0; c < categoryOptionJson.categoryOptions.length; c++) {
                                        if (filData[key].categories[a].categoryOptions[b].id == categoryOptionJson.categoryOptions[c].id) {
                                            var result = $.grep(filData[key].categoryOptions, function (e) {
                                                return e.id === categoryOptionJson.categoryOptions[c].id;
                                            });
                                            if (result.length == 0) {
                                                filData[key].categoryOptions.push(categoryOptionJson.categoryOptions[c]);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }



                    var v = (filData[key]);
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
                            saveSync(response.importTypeSummaries, filData[key], instance, response);

                        })
                        .error(function (response) {
                            //$().toastmessage('showErrorToast', 'Make Sure Whether the Instance <br/>' + instance.name + ' is Connected . ');
                            $().toastmessage('showErrorToast', response);
                            console.log("sync is failed - error response");
                            console.log(response);
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

    function saveSync(respo, filData, instance, res) {

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
            saveNotification($http, $rootScope, t, instance, filData, respo);
            saveHistory($http, $rootScope, t, instance, filData, respo);
            if (res != "error") {
                msgSummary($http, $rootScope, filData, res, instance, respo);
            }
        });

    }

    function saveNotification($http, $rootScope, t, instance, fildata, respo) {
        var notifications = {};
        var newNotification = {};

        if (t == 0) {
            newNotification.notification = "All the MetaData Updates Were Successful";
            newNotification.instance = instance.name;
            newNotification.metaDataFilterd = fildata;
            newNotification.response = respo;
        }
        if (t == 1) {
            newNotification.notification = "Some of the MetaData field Updates Were Successful";
            newNotification.instance = instance.name;
            newNotification.metaDataFilterd = fildata;
            newNotification.response = respo;
        }

        if (t == 2) {
            newNotification.notification = "Error In Network";
            newNotification.instance = instance.name;
            newNotification.metaDataFilterd = fildata;
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
                // notifications.data = [];
            }
            else {
                notifications.data = [];
            }
            notifications.data.push(newNotification);
            notifyJSON = JSON.stringify(notifications);

            postNotification($http, $rootScope, notifyJSON);

        });
    }

    function saveHistory($http, $rootScope, t, instance, fildata, respo) {
        var history = {};
        var newHistory = {};
        if (t == 0) {
            newHistory.notification = "All the MetaData Updates Were Successful";
            newHistory.instance = instance.name;
            newHistory.metaDataFilterd = fildata;
            newHistory.response = respo;

        }
        if (t == 1) {
            newHistory.notification = "Some of the MetaData field Updates Were Successful";
            newHistory.instance = instance.name;
            newHistory.metaDataFilterd = fildata;
            newHistory.response = respo;

        }

        if (t == 2) {
            newHistory.notification = "Error In Network";
            newHistory.instance = instance.name;
            newHistory.metaDataFilterd = fildata;
            newHistory.response = respo;

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

    function msgSummary($http, $rootScope, filData, response, instance, respo) {
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
            if (respo[j].status == "SUCCESS" && respo[j].type == "Indicator") {
                allSyncData += '\n Indicators-:\n ';
                for (var k = 0; k < filData.indicators.length; k++) {
                    allSyncData += filData.indicators[k].name + '\n';
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "IndicatorType") {
                allSyncData += '\n Indicator Types-:\n ';
                for (var k = 0; k < filData.indicatorTypes.length; k++) {
                    allSyncData += filData.indicatorTypes[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "IndicatorGroupSet") {
                allSyncData += '\n Indicator Group Sets-:\n ';
                for (var k = 0; k < filData.indicatorGroupSets.length; k++) {
                    allSyncData += filData.indicatorGroupSets[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "IndicatorGroup") {
                allSyncData += '\n Indicator Groups-:\n ';
                for (var k = 0; k < filData.indicatorGroups.length; k++) {
                    allSyncData += filData.indicatorGroups[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "DataElement") {
                allSyncData += '\n Data Elements-:\n ';
                for (var k = 0; k < filData.dataElements.length; k++) {
                    allSyncData += filData.dataElements[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "DataElementCategoryCombo") {
                allSyncData += '\n Category Combos-:\n ';
                for (var k = 0; k < filData.categoryCombos.length; k++) {
                    allSyncData += filData.categoryCombos[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "DataElementCategory") {
                allSyncData += ' \nCategories-:\n ';
                for (var k = 0; k < filData.categories.length; k++) {
                    allSyncData += filData.categories[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "DataElementCategoryOption") {
                allSyncData += ' \nCategory Options-:\n ';
                for (var k = 0; k < filData.categoryOptions.length; k++) {
                    allSyncData += filData.categoryOptions[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "CategoryOptionCombo") {
                allSyncData += '\n Category Option Combos-:\n ';
                for (var k = 0; k < filData.categoryOptionCombos.length; k++) {
                    allSyncData += filData.categoryOptionCombos[k].name + "\n";
                }
            }
            if (respo[j].status == "SUCCESS" && respo[j].type == "Attribute") {
                allSyncData += '\n Attributes-:\n ';
                for (var k = 0; k < filData.attributes.length; k++) {
                    allSyncData += filData.attributes[k].name + "\n";
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


});
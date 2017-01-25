(function() {
    var PopulationController = function($scope, dataFactory) {
        $scope.showStatus = false;
        $scope.jsonInput = "";
        $scope.urlInput = "";

        var populationData = "";
        var totalPopulation = 0;

        var totalFemales = 0;
        var totalMales = 0;

        var fnamesTop = 0;
        var fnamesBottom = 0;
        var lnamesTop = 0;
        var lnamesBottom = 0;

        var agerange1 = 0;
        var agerange2 = 0;
        var agerange3 = 0;
        var agerange4 = 0;
        var agerange5 = 0;
        var agerange6 = 0;

        var statePopulations = [];

        var expression = "";

        $scope.submit = function() {
            if ($scope.jsonInput !== "") {
                $scope.populationData = $scope.jsonInput;
            } else {
                dataFactory.getData($scope.urlInput)
                    .then(function(response) {
                        populationData = response.data;

                        // CALCULATE THE TOTAL POPULATION OF THE DATA
                        totalPopulation = populationData.results.length;
                        $scope.n = totalPopulation;

                        var namelistLength = function(namearr, pos) {
                            var listarr = [];
                            for (var i = 0; i < namearr.length; i++) {
                                var item = namearr[i];
                                var firstLetter = item[0].toUpperCase();

                                if (pos === 'top') {
                                    if (firstLetter <= 'M') {
                                        listarr.push(item);
                                    }
                                } else {
                                    if (firstLetter > 'M') {
                                        listarr.push(item);
                                    }
                                }
                            }

                            return listarr.length;
                        };

                        var agerangeLength = function(agearr, lower, upper) {
                            var listarr = [];
                            var rangearr = [];

                            var age = function(dob) {
                                var today = new Date();
                                var currentYear = today.getFullYear();
                                var bdate = new Date(dob);
                                var birthYear = bdate.getFullYear();

                                return currentYear - birthYear;
                            }

                            for (var i = 0; i < agearr.length; i++) {
                                listarr.push(age(agearr[i]));
                            }

                            for (var j = 0; j < listarr.length; j++) {
                                if (arguments.length === 3) {
                                    if (listarr[j] >= lower && listarr[j] <= upper) {
                                        rangearr.push(listarr[j]);
                                    }
                                } else {
                                    if (listarr[j] > 100) {
                                        rangearr.push(listarr[j]);
                                    }
                                }
                            }

                            return rangearr.length;
                        }

                        // CALCULATE THE TOTL
                        expression = "$..gender";
                        var populationList = jsonpath.query(populationData, expression);


                        // CHART 1 DATA CALCULATION
                        expression = "$..results[?(@.gender=='female')]";
                        var femaleList = jsonpath.query(populationData, expression);
                        totalFemales = femaleList.length;
                        var femalePercentage = (totalFemales / totalPopulation) * 100;
                        $scope.femalePercentage = femalePercentage.toFixed(1);

                        expression = "$..results[?(@.gender=='male')]";
                        var maleList = jsonpath.query(populationData, expression);
                        totalMales = maleList.length;
                        var malePercentage = (totalMales / totalPopulation) * 100;
                        $scope.malePercentage = malePercentage.toFixed(1);

                        $scope.chart1Labels = ["Males", "Females"];
                        $scope.chart1Data = [malePercentage, femalePercentage];


                        // CHART 2 DATA CALCULATION
                        expression = "$..first";
                        var fnameList = jsonpath.query(populationData, expression);
                        fnamesTop = namelistLength(fnameList, 'top');
                        var fntPercentage = (fnamesTop / totalPopulation) * 100;
                        $scope.fntPercentage = fntPercentage.toFixed(1);

                        fnamesBottom = namelistLength(fnameList, 'bottom');
                        var fnbPercentage = (fnamesBottom / totalPopulation) * 100;
                        $scope.fnbPercentage = fnbPercentage.toFixed(1);

                        $scope.chart2Labels = ["A-M", "N-Z"];
                        $scope.chart2Data = [fntPercentage.toFixed(1), fnbPercentage.toFixed(1)];


                        // CHART 3 DATA CALCULATION
                        expression = "$..last";
                        var lnameList = jsonpath.query(populationData, expression);

                        lnamesTop = namelistLength(lnameList, 'top');
                        var lntPercentage = (lnamesTop / totalPopulation) * 100;
                        $scope.lntPercentage = lntPercentage.toFixed(1);

                        lnamesBottom = namelistLength(lnameList, 'bottom');
                        var lnbPercentage = (lnamesBottom / totalPopulation) * 100;
                        $scope.lnbPercentage = lnbPercentage.toFixed(1);

                        $scope.chart3Labels = ["A-M", "N-Z"];
                        $scope.chart3Data = [lntPercentage.toFixed(1), lnbPercentage.toFixed(1)];


                        // CHART 4 DATA CALCULATION
                        expression = "$..state";
                        var statesList = jsonpath.query(populationData, expression);
                        statesList.sort();
                        var statePopulation = statesList.reduce(function(acc, curr) {
                            if (typeof acc[curr] == 'undefined') {
                                acc[curr] = 1;
                            } else {
                                acc[curr] += 1;
                            }
                            return acc;
                        }, {});

                        var sortedStates = [];
                        for (var state in statePopulation) {
                            sortedStates.push([state, statePopulation[state]]);
                        }

                        $scope.chart4Data = [];
                        $scope.chart4Labels = [];

                        // Sort state population data in descending order
                        sortedStates.sort(function(a, b) { return b[1] - a[1] });
                        if (sortedStates.length >= 10) {
                            for (var i = 0; i < 10; i++) {
                                var chartPercentage = (sortedStates[i][1] / totalPopulation) * 100;
                                $scope.chart4Data.push(chartPercentage.toFixed(1));
                                $scope.chart4Labels.push(sortedStates[i][0]);
                            }
                        } else {
                            for (var i = 0; i < sortedStates.length; i++) {
                                var chartPercentage = (sortedStates[i][1] / totalPopulation) * 100;
                                $scope.chart4Data.push(chartPercentage.toFixed(1));
                                $scope.chart4Labels.push(sortedStates[i][0]);
                            }
                        }


                        // CHART 5 DATA CALCULATION
                        var femaleData = [];
                        for (var j = 0; j < populationData.results.length; j++) {
                            var arrayItem = [];
                            if (populationData.results[j]["gender"] === "female") {
                                femaleData.push(populationData.results[j].location["state"]);
                            }
                        }
                        femaleData.sort();
                        var stateFemales = femaleData.reduce(function(acc, curr) {
                            if (typeof acc[curr] == 'undefined') {
                                acc[curr] = 1;
                            } else {
                                acc[curr] += 1;
                            }
                            return acc;
                        }, {});

                        var sortedFemales = [];
                        for (var state2 in stateFemales) {
                            sortedFemales.push([state2, stateFemales[state2]]);
                        }
                        $scope.chart5Data = [];
                        $scope.chart5Labels = [];
                        sortedFemales.sort(function(a, b) { return b[1] - a[1] });
                        if (sortedFemales.length >= 10) {
                            for (var k = 0; k < 10; k++) {
                                var femalePercentage = (sortedFemales[k][1] / totalPopulation) * 100;
                                $scope.chart5Data.push(femalePercentage.toFixed(1));
                                $scope.chart5Labels.push(sortedFemales[k][0]);
                            }
                        } else {
                            for (var k = 0; k < sortedFemales.length; k++) {
                                var femalePercentage = (sortedFemales[k][1] / totalPopulation) * 100;
                                $scope.chart5Data.push(femalePercentage.toFixed(1));
                                $scope.chart5Labels.push(sortedFemales[k][0]);
                            }
                        }


                        // CHART 6 DATA CALCULATION
                        var maleData = [];
                        for (var l = 0; l < populationData.results.length; l++) {
                            var arrayItem = [];
                            if (populationData.results[l]["gender"] === "male") {
                                maleData.push(populationData.results[l].location["state"]);
                            }
                        }
                        maleData.sort();
                        var stateMales = maleData.reduce(function(acc, curr) {
                            if (typeof acc[curr] == 'undefined') {
                                acc[curr] = 1;
                            } else {
                                acc[curr] += 1;
                            }
                            return acc;
                        }, {});

                        var sortedMales = [];
                        for (var state3 in stateMales) {
                            sortedMales.push([state3, stateMales[state3]]);
                        }

                        $scope.chart6Data = [];
                        $scope.chart6Labels = [];
                        sortedMales.sort(function(a, b) { return b[1] - a[1] });
                        if (sortedMales.length >= 10) {
                            for (var m = 0; m < 10; m++) {
                                var malePercentage = (sortedMales[m][1] / totalPopulation) * 100;
                                $scope.chart6Data.push(malePercentage.toFixed(1));
                                $scope.chart6Labels.push(sortedMales[m][0]);
                            }
                        } else {
                            for (var m = 0; m < sortedMales.length; m++) {
                                var malePercentage = (sortedMales[m][1] / totalPopulation) * 100;
                                $scope.chart6Data.push(malePercentage.toFixed(1));
                                $scope.chart6Labels.push(sortedMales[m][0]);
                            }
                        }


                        // CHART 7 DATA CALCULATION
                        expression = "$..dob";
                        var ageList = jsonpath.query(populationData, expression);

                        agerange1 = agerangeLength(ageList, 0, 20);
                        var ar1per = (agerange1 / totalPopulation) * 100;

                        agerange2 = agerangeLength(ageList, 21, 40);
                        var ar2per = (agerange2 / totalPopulation) * 100;

                        agerange3 = agerangeLength(ageList, 41, 60);
                        var ar3per = (agerange3 / totalPopulation) * 100;

                        agerange4 = agerangeLength(ageList, 61, 80);
                        var ar4per = (agerange4 / totalPopulation) * 100;

                        agerange5 = agerangeLength(ageList, 81, 100);
                        var ar5per = (agerange5 / totalPopulation) * 100;

                        agerange6 = agerangeLength(ageList);
                        var ar6per = (agerange6 / totalPopulation) * 100;


                        $scope.chart7Labels = ["0-20", "21-40", "41-60", "61-80", "81-100", "100+"];
                        $scope.chart7Data = [ar1per.toFixed(1), ar2per.toFixed(1), ar3per.toFixed(1), ar4per.toFixed(1), ar5per.toFixed(1), ar6per.toFixed(1)];

                        $scope.showStatus = true;
                    });
            }
        }

        $scope.clear = function() {
            $scope.jsonInput = "";
            $scope.urlInput = "";
            $scope.showStatus = false;
        }
    };

    PopulationController.$inject = ['$scope', 'dataFactory'];

    angular.module('infographicsApp')
        .controller('PopulationController', PopulationController);
})();
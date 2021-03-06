app.controller("polisCtrl",function(myFactory, $http, $location, $scope, $rootScope){
    if (myFactory.calculationName!=="" && myFactory.calculationName!==undefined) this.calculationName = myFactory.calculationName;
    else if (myFactory.calcObj.isLinked) this.calculationName = 'привязанный';
    else if (!myFactory.calcObj.isInited) this.calculationName = 'не выбран';
    if (myFactory.newClientCard) this.companyName = myFactory.newClientCard['Данные компании']['Наименование организации'];
    myFactory.parks.forEach((park)=>{
        park.processes.forEach((process)=>{
            process.showCars=false;
        })
    })
    this.myFactory = myFactory;
    $scope.myFactory = myFactory;
    // FIXME: переписать на загрузку из папки src/*.json
    $scope.currObj=[
        {
            "name": "Компания",
            "type": "search/create",
            "values": [
                {
                    "name": ""
                }
            ]
        },
        {
            "name": "Расчет",
            "type": "search/create",
            "values": [
                {
                    "name": ""
                }
            ]
        },
        {
            "name": "Оговорки и условия",
            "type": "lists",
            "values":[
                {
                    "name": "Базовые риски застрахованы",
                    "type": "multi_button"
                },
                {
                    "name": "За исключением",
                    "type": "multi_button"
                },
                {
                    "name": "Новый список",
                    "type": "button"
                }
            ]
        },
        {
            "name": "Финансы",
            "type": "finance",
            "values": [
                {
                    "name": "something"
                },
                {
                    "name": "anything"
                }
            ]
        },
        {
            "name": "Даты",
            "type": "dates",
            "values":[]
        }
    ];



    $scope.itemsList = {
        items1: [],
        items2: []
    };

    for (i = 0; i <= 5; i += 1) {
        $scope.itemsList.items1.push({'Id': i, 'Label': 'Item A_' + i});
    }

    for (i = 0; i <= 5; i += 1) {
        $scope.itemsList.items2.push({'Id': i, 'Label': 'Item B_' + i});
    }
    $scope.sortableOptions = {
        containment: '#horizontal-container',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        itemMoved: function (event) {
            console.log(1)
        }
    };




    $scope.returnToDashboard=()=>{
        $location.path('/');
    };
    $scope.clicking=(event, process)=>{
        event.stopImmediatePropagation();
        myFactory.parks.forEach((park)=>{
            park.processes.forEach((process)=>{
                process.showCars=false;
            })
        })
        process.showCars=!process.showCars;
    }
    $scope.console=(param)=>{
        console.dir($scope.itemsList.items1);
    }

    $scope.changeLocation = (value) => {
        $scope.myFactory.cameFrom = {
            name: 'Проект документа',
            path: $location.$$path,
        };
        switch(value){
            case "Компания":
                $location.path(`/company`);
                break;
            case "Расчет":
                $location.path(`/calculation`);
                break;
        }
    }
    $scope.newDashboard={
        currentPage:0,
        previousPage: -1,
        toLeft(index){
            return this.previousPage<this.currentPage && this.previousPage==index;
        },
        toRight(index){
            return this.previousPage>this.currentPage && this.previousPage==index;
        },
        fromLeft(index){
            return this.previousPage>this.currentPage && this.currentPage==index;
        },
        fromRight(index){
            return this.previousPage<this.currentPage && this.currentPage==index;
        },
        checkCurrentPage(index){
            return index===this.currentPage;
        },
        setCurrentPage(index){
            this.previousPage=this.currentPage;
            this.currentPage=index;
            $rootScope.search_result=[];
            $scope.currObj.forEach( param=>{
                if(param.type=='search/create'){
                    param.values[0].name="";
                }
            })
        },
    }
    if(myFactory.makingPolis!==false){
        switch(myFactory.makingPolis){
            case "Расчет":
                $scope.newDashboard.setCurrentPage(1);
                break;
            case "Компания":
                $scope.newDashboard.setCurrentPage(0);
                break;
        }
    }  
    myFactory.makingPolis=true;
    $scope.loadProcess=(process, key)=>{
        myFactory.loadProcess={
            process,
            key
        }
        $location.path(`/calculation`);
    }
    $scope.loadClient=(key)=>{
        myFactory.loadClient=key;
    }
    this.makePDF=()=>{
        const getRisks=()=>{
            return new Promise((resolve, reject)=>{
                const xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', ()=>{
                    if(xhr.readyState==4){
                        resolve(JSON.parse(xhr.responseText));
                        
                    }
                })
                xhr.open("GET", "./src/HIP.json", true);
                xhr.send();
            })
        };
        getRisks().then((data)=>{
            let risks=[];
            data.forEach(({model, values})=>{
                if(model=="risk"){
                    values.forEach((value)=>{
                        if(value.action===undefined && value.type==="risk") risks.push(value);
                    })
                }
            })
            console.log(risks);
            
            polis.makePDF(myFactory, risks);
            return null;
        },function error (response){
            console.log(response);

        })
    }
    if (!($rootScope.search_result)) $scope.newDashboard.setCurrentPage(0);
    if ($rootScope.search_result) $rootScope.search_result=[];
})
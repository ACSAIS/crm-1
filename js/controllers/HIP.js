/**
 * Created by RoGGeR on 17.07.17.
 */
"use strict";
app.controller("HIP", function ($http, myFactory, $rootScope, $scope) {
    $rootScope.cacheTemplate={};

    this.myFactory=myFactory;
    this.delete=function(process){
        if(process.multi) {
            if (process.multi.multi) {
                process.multi.multi.processes.splice(process.multi.multi.processes.indexOf(process.multi),1);
            }
            process.multi.processes.splice(process.multi.processes.indexOf(process),1); 
            if (process.multi.processes.length<2) {
                let newMulti;
                if (process.multi.prevMulti) newMulti = process.multi.prevMulti;
                else if (process.multi.multi) newMulti = process.multi.multi;
                if (newMulti) {
                    // если в мульти узле остался только один проц
                    // то удаляем этот мульти, а оставшемуся процу присваиваем предыдущим мульти узел
                    process.multi.processes[0].multi = newMulti;
                    if (!newMulti.processes) {
                        throw new Error('Верхний мульти с другой структурой. Нет .processes');
                        debugger;
                    }
                    newMulti.processes.push(process.multi.processes[0]);
                }
                myFactory.multi.multies.splice(myFactory.multi.multies.indexOf(process.multi),1);
            }
        }
        if(process.park.processes.length>1) {
            //удаляем процесс из парка
            process.park.processes.splice(process.park.processes.indexOf(process),1);
        }
        // если процесс единственный в парке, удаляем парк
        else myFactory.parks.splice(myFactory.parks.indexOf(process.park), 1);
        myFactory.finalCalc();
    };
    this.copy=function(process){
        let proc=new Process(process);
        // если копируем внутри мульти узла, то новый проц перемещаем в конец парка, чтобы он не мешался в мульти узле
        process.park.processes.splice(process.park.processes.indexOf(process)+1,0,proc);
        for(let key in proc){
            if(transportProp.indexOf(key)==-1 && key!="park" && key!="totalPrice") delete proc[key];
        }
        myFactory.fixHeight();
        return proc;
    };
    if (this.myFactory.currObj) {
        for(let i=0;i<this.myFactory.currObj.length; i++){
            let currObj=myFactory.currObj;
            for(let j=0; j<currObj[i].values.length;j++){
                if(currObj[i].values[j].type=="risk") risks[currObj[i].values[j].name]=currObj[i].values[j].value;
            }
        }
    }
    $scope.$on('$destroy', function() {
        myFactory.cleanProcess();
        $rootScope.mode="";
    });
    this.consolelog=function (val) {
        console.log(val);
    };

    $rootScope.mode="calc";
    let scope=this;

});

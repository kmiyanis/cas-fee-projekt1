document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    /*-------------------------------------------------------------------
     * Variables
     */
    let html = document.getElementsByTagName('html')[0];


    /*-------------------------------------------------------------------
     * Switch Stylesheet
     */

    let themeSwicher = document.getElementById('js-theme-swicher');


    function loadStylesheet (){
        let localStylesheet = localStorage.getItem("toDoer_stylesheet");
        if(localStylesheet !== null) {
            themeSwicher.value = localStylesheet;
            switchStyle (localStylesheet);
        }
    }

    function switchStyle (themeSwicher){

        let newTheme = themeSwicher;

        if(themeSwicher.target) {
            newTheme = themeSwicher.target.value;
        }

       // let styles = document.querySelectorAll('[data-theme*="data-theme"]:not(#layout)');
        let styles = document.querySelectorAll('[data-theme]');

        styles.forEach(function(el){
            if(el.dataset.theme === newTheme) {
                el.disabled = false;
                el.setAttribute('rel', 'stylesheet');
                localStorage.setItem("toDoer_stylesheet",newTheme);
            } else {
                el.disabled = true;
                el.setAttribute('rel', 'stylesheet alternate');
            }
        });
        /* I have to remove title attribute due to chrome,
        *  but firefox view-> stylesheet does not update, when I change stylesheet per JS
        * */
    }

    loadStylesheet ();
    //document.addEventListener("DOMContentLoaded",readStyle, false);
    themeSwicher.addEventListener('change', switchStyle);


    /*-------------------------------------------------------------------
     * Mobile Filter
     */

    let iconMobileGear = document.getElementsByClassName('js-open-mobile-filter')[0];

    iconMobileGear.addEventListener('click', () => {
        html.classList.toggle('mobile-filter--open');
    });


    /*-------------------------------------------------------------------
     * show toDo List
     */
    function showData() {
        let storageObj = toDoRepo.getAll();
        compileListHtml(storageObj);
    }

    function compileListHtml(context) {
        // Grab the template script
        let getTempHtml = document.getElementById("entry-template").innerHTML.trim();
        // Compile the template
        let template = Handlebars.compile(getTempHtml);

        document.getElementById("js-hb-main").innerHTML = template(context);
        isEllipsisCheck();
    }

    function isEllipsisActive(e) {
        return (e.offsetWidth < e.scrollWidth);
    }
    function isEllipsisCheck() {
        let description = document.getElementsByClassName("entry__description");

        for(let i = 0; i < description.length; i++) {
            let el = description[i];

            if(isEllipsisActive(el)) {
                el.classList.add('long');
                el.addEventListener('click', function(){
                    this.classList.toggle('open');
                } ,false);
            } else {
                el.classList.remove('long');
                el.classList.remove('open');
            }
        }
    }

    showData();

    /*-------------------------------------------------------------------
     * Form Layer toggle
     */

    let openFormLayer = function () {
        html.classList.add('form-mask--open');
        html.classList.remove('mobile-filter--open');
    };

    let closeFormLayer = function () {
        showData();
        html.classList.remove('form-mask--open');
    };



    /*-------------------------------------------------------------------
     * Add Form open
     */

    let addEventFormOpenBtn = function (e) {
        if(e.target.classList.contains('js-open-form')){
            compileFormHtml();
            openFormLayer();
        }
    };
    document.body.addEventListener('click', addEventFormOpenBtn, false);


    /*-------------------------------------------------------------------
     * Edit Form open
     */

    let editTodo = function (e) {
        if(e.target.classList.contains('js-todo-edit')){
            let todoId =  e.target.dataset.id;
            console.log(todoId);
            let content = toDoRepo.getOneTodo(todoId);
            console.log(content);
            compileFormHtml(content);
            openFormLayer();
        }
    };

    document.body.addEventListener('click', editTodo, false);

    /*-------------------------------------------------------------------
     * Delete Entry
     */

    let deleteTodo = function (e) {
        if(e.target.classList.contains('js-todo-delete')){
            let todoId =  e.target.dataset.id;
            toDoRepo.deleteTodo(todoId);
            showData();
        }
    };

    document.body.addEventListener('click', deleteTodo, false);

    /*-------------------------------------------------------------------
     * Update status
     */

    let updateStatus = function (e) {
        if(e.target.classList.contains('js-todo-status')){
            let _this = e.target;
            let todoId =  _this.dataset.id;
            let status = false;
            _this.classList.toggle('checked');

            if(_this.classList.contains('checked')) {
                status = true;
            }
            toDoRepo.updateStatue(todoId, status);
            showData();
        }
    };
    document.body.addEventListener('click', updateStatus, false);



    /*-------------------------------------------------------------------
     * complile Form Html
     */

    function compileFormHtml(context = {}) {
        // Grab the template script
        let getTempHtml = document.getElementById("form-template").innerHTML.trim();

        // Compile the template
        let template = Handlebars.compile(getTempHtml);

        document.getElementById("js-hb-form").innerHTML = template(context);

        //init Event
        setImportance(context.importance);
        loadDatePicker(context.deadline);
        document.getElementsByClassName("js-form-submit")[0].addEventListener('click', validForm,false);
        document.getElementsByClassName("js-form-close")[0].addEventListener('click', closeFormLayer ,false);
        liveFieldValid(document.getElementById('title'));
        liveFieldValid(document.getElementById('descroption'));
    }


    /*-------------------------------------------------------------------
     * close Entry From


    let addEventFormCancelBtn = function (e) {
        if(e.target.classList.contains('js-form-close')){
            closeFormLayer();
        }
    }
    document.body.addEventListener('click', addEventFormCancelBtn, false);
     */

    /*-------------------------------------------------------------------
     * Importance
     */

    function setImportance (val=-1) {

        let ratingLabel = document.getElementsByClassName("rating__label");
        if(ratingLabel.length <= 0)  {
            return;
        }

        for(let i = 0; i < ratingLabel.length; i++) {
            if(i === parseInt(val)) {
                ratingLabel[i].classList.add('active');
                ratingLabel[i].firstChild.checked = true;
            }
            ratingLabel[i].addEventListener('click', function(){
                removeActive();
                this.classList.add('active');
            });
        }

        function removeActive() {
            for(let i = 0; i < ratingLabel.length; i++) {
                ratingLabel[i].classList.remove('active');
            }
        }
    }



    /*-------------------------------------------------------------------
     * Calender plugin
     */
    function loadDatePicker(val){

        //let _minDate = val === undefined ? new Date() : '';
        let _setDefaultDate = val === undefined ? '' : val;
       // console.log('_setDefaultDate val = '+_setDefaultDate);
        let picker = new Pikaday({
            field: document.getElementById('datepicker'),
            firstDay: 1,
            minDate: new Date(),
            bound: false,
            container: document.getElementById('datepicker__container'),
            onSelect: function() {
                document.getElementById('js-date-text').innerHTML = this.getMoment().format('D/M/YYYY');
            }
        });
        picker.setDate(_setDefaultDate);
    }


    /*-------------------------------------------------------------------
     *  finished Entry Visiblility
     */
    function loadShowDone (){
        let storedShowDone = JSON.parse(localStorage.getItem("toDoer_show-done"));
        let showDoneButton = document.getElementById("js-show-done");

        if(storedShowDone === true) {
            html.classList.add('show-done');
            showDoneButton.classList.add('selected');
        } else {
            html.classList.remove('show-done');
            showDoneButton.classList.remove('selected');
        }
    }



    let setShowDone = function (){
        this.classList.toggle('selected');
        if(this.classList.contains('selected')) {
            html.classList.add('show-done');
            JSON.stringify(localStorage.setItem("toDoer_show-done", true));
        } else {
            html.classList.remove('show-done');
            JSON.stringify(localStorage.setItem("toDoer_show-done", false));
        }
    };

    loadShowDone ();
    document.getElementById("js-show-done").addEventListener('click', setShowDone ,false);


    /*-------------------------------------------------------------------
     * Sort
     */

    loadFilters ();

    function loadFilters (){
        let filter = localStorage.getItem('toDoer_filter');
        console.log(filter !== null);
        if(filter !== '' && filter !== null) {
            let filterToSelect = document.querySelectorAll("[data-sort='"+filter+"']");
            removeFilterClass();
            filterToSelect[0].classList.add('selected');
        } else {
            let filterDefault = document.getElementsByClassName("js-filter-sort selected");
            if(filterDefault.length > 0 ) {
                localStorage.setItem("toDoer_filter", filterDefault[0].dataset.sort);
            }
        }
    }

    function removeFilterClass(){
        let filters = document.getElementsByClassName("js-filter-sort selected");
       // console.log(filters.length);
        for(let i = 0; i < filters.length; i++) {
            filters[i].classList.remove('selected');
        }
    }

    let setFilter = function (e) {
        if(e.target.classList.contains('js-filter-sort')){
            let filters = document.getElementsByClassName("js-filter-sort");
            let currentFilter ='';

            for(let i = 0; i < filters.length; i++) {

                if(filters[i] === e.target) {
                    filters[i].classList.toggle('selected');

                    if(filters[i].classList.contains('selected')) {
                        //console.log(filters[i]);
                        console.log(filters[i].dataset.sort);
                        currentFilter = filters[i].dataset.sort;
                        localStorage.setItem("toDoer_filter", filters[i].dataset.sort);

                    } else {
                        localStorage.setItem("toDoer_filter", '');

                    }
                } else {
                    filters[i].classList.remove('selected');
                }
            }
            console.log('currentFilter = '+currentFilter);
            showData();
        }
    };

    document.body.addEventListener('click', setFilter, false);


    /*-------------------------------------------------------------------
     * Form Validation
     */

    function validForm(e){
        e.preventDefault();
        let todo = {};
        let title = document.getElementById('title');
        let descroption = document.getElementById('descroption');
        let error = 0;

        let _id = document.getElementsByClassName('form__submit')[0].dataset.id;

        if(isFieldValid(title) === 1) {
            todo.title = title.value;
        } else {
            error++;
        }
        if(isFieldValid(descroption) === 1) {
            todo.descroption = descroption.value;
        } else {
            error++;
        }

        let importanceChecked = document.querySelector('input[name = "starValue"]:checked');

        todo.importance =  importanceChecked === null ? '' : importanceChecked.value;
        todo.deadline = document.getElementById('datepicker').value;

        if(error > 0) {
            return;
        }
        if(_id === '') {
            toDoRepo.addToDo(todo);
        } else {
            todo.id = parseInt(_id, 10);
            toDoRepo.updateToDo(todo);
        }

        closeFormLayer();
    }

    function isFieldValid(el) {

       if( el.value.length === 0) {
            el.classList.add('error');
            return -1;
        } else {
           el.classList.remove('error');
           return 1;
       }
    }

    function liveFieldValid(el) {
        el.addEventListener("input", function () {
            isFieldValid(this)
        });
    }

});


Handlebars.registerHelper('stars', function(n, block) {
    let accum = '';

    for(let i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});


Handlebars.registerHelper('dateFromNow', function dateFromNow(context, block) {
    let s = block.hash.suffix || false;
    return moment(context).fromNow(s);
});


//  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function(context, block) {
    if (window.moment) {
        let f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
        return moment(context).format(f); //had to remove Date(context)
    }else{
        return context;   //  moment plugin not available. return data as is.
    }
});
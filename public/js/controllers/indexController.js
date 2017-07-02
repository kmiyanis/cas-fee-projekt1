document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const client = window.services.restClient;

    /*-------------------------------------------------------------------
     * Variables
     */
    let html = document.getElementsByTagName('html')[0];
    let divTodoList = document.getElementById("js-todo-list");
    let divTodoform = document.getElementById("js-todo-form");

    // Form Template
    let getFormTempHtml = document.getElementById("form-template").innerHTML.trim();
    let formTemplate = Handlebars.compile(getFormTempHtml);

    // List Template
    let getListTempHtml = document.getElementById("list-template").innerHTML.trim();
    let templateList = Handlebars.compile(getListTempHtml);

    const filterDefault = 'importance';


    /*-------------------------------------------------------------------
     * Switch Stylesheet
     */

    let themeSwicher = document.getElementById('js-theme-swicher');

    function loadStylesheet() {
        let localStylesheet = localStorage.getItem("toDoer_stylesheet");
        if (localStylesheet !== null) {
            themeSwicher.value = localStylesheet;
            switchStyle(localStylesheet);
        }
    }

    function switchStyle(themeSwicher) {

        let newTheme = themeSwicher;

        if (themeSwicher.target) {
            newTheme = themeSwicher.target.value;
        }

        let styles = document.querySelectorAll('[data-theme]');

        styles.forEach(function (el) {
            if (el.dataset.theme === newTheme) {
                el.disabled = false;
                el.setAttribute('rel', 'stylesheet');
                localStorage.setItem("toDoer_stylesheet", newTheme);
            } else {
                el.disabled = true;
                el.setAttribute('rel', 'stylesheet alternate');
            }
        });

    }

    loadStylesheet();

    themeSwicher.addEventListener('change', switchStyle);


    /*-------------------------------------------------------------------
     * show List
     */

    showData();

    function showData() {

        let filter = initFilter();
        client.getAll(filter).then(function (todos) {
            let notDone = todos.filter((a) => a.isDone === false);
            let allDone = false;
            if(notDone.length === 0) {
                allDone = true;
            }
            compileListHtml( {'todos':todos, 'allDone': allDone});
        })
    }


    /*-------------------------------------------------------------------
     * complile  Html
     */

    function compileListHtml(todos) {
        for (let i = 0 ; i < todos.length ; i++) {
            if(todos[i].deadline.length > 0) {
                todos[i].deadline = new Date(`${todos[i].deadline} 23:59:59`);
            }
        }

        document.getElementById("js-todo-list").innerHTML = templateList(todos);
        descFoldingCheck();
    }

    function compileFormHtml(context = {}) {
        document.getElementById("js-todo-form").innerHTML = formTemplate(context);

        //init Event
        setImportance(context.importance);
        loadDatePicker(context.deadline);

        liveFieldValid(document.getElementById('title'));
        liveFieldValid(document.getElementById('description'));
    }


    /*-------------------------------------------------------------------
     * Entry Description Folding
     */

    function descFoldingCheck() {
        let description = document.getElementsByClassName("entry__description");

        for (let i = 0; i < description.length; i++) {
            let _this = description[i];
            let _thisCont = _this.firstElementChild;

            if (_this.offsetHeight < _thisCont.offsetHeight) {
                _this.classList.add('long');
            } else {
                _this.classList.remove('long');
            }
        }
    }

    function eventFoldingArrow(e) {
        let _this = e.target;
        let _thisParent = e.target.parentElement;

        if (_thisParent.classList.contains('long') === false) {
            return;
        }
        if (_thisParent.classList.contains('open')) {
            _thisParent.classList.remove('open');
            _thisParent.style.maxHeight = '';
        } else {
            const contentHeight = _this.getBoundingClientRect().height;
            _thisParent.style.maxHeight = `${contentHeight}px`;
            _thisParent.classList.add('open');
        }
    }

    divTodoList.addEventListener('click', eventFoldingArrow, false);
    window.addEventListener('resize', descFoldingCheck, true);


    /*-------------------------------------------------------------------
     * Form Layer toggle
     */

    function openFormLayer() {
        html.classList.add('form-mask--open');
        html.classList.remove('mobile-filter--open');
    }

    function closeFormLayer() {
        showData();
        html.classList.remove('form-mask--open');
    }


    /*-------------------------------------------------------------------
     * Form Events
     */

    function formEvents(e) {

        if (e.target.classList.contains('js-open-form')) {
            compileFormHtml();
            openFormLayer();
        }

        if (e.target.classList.contains('js-todo-edit')) {
            let todoId = e.target.dataset.id;
            client.getOne(todoId).then(function (todo) {
                compileFormHtml(todo);
                openFormLayer();
            })
        }

        if (e.target.classList.contains('js-form-close')) {
            closeFormLayer();
        }
    }

    document.addEventListener('click', formEvents, false);


    /*-------------------------------------------------------------------
     * submit From
     */

    function submitFormBtn(e) {
        if (e.target.classList.contains('js-form-submit')) {
            let result = validForm(e);
            if (result.errorCounter === 0) {
                if (result._id === '') {
                    client.addTodo(result.todo).then(function () {
                        closeFormLayer();
                    });
                } else {
                    client.editTodo(result._id, result.todo).then(function () {
                        closeFormLayer();
                    });
                }
            }
        }
    }

    divTodoform.addEventListener('click', submitFormBtn, true);


    /*-------------------------------------------------------------------
     * Form Validation
     */

    function validForm(e) {
        e.preventDefault();
        let todo = {};
        let title = document.getElementById('title');
        let description = document.getElementById('description');
        let errorCounter = 0;
        let _id = document.getElementsByClassName('form__submit')[0].dataset.id;

        if (isFieldValid(title) === true) {
            todo.title = title.value;
        } else {
            errorCounter++;
        }
        if (isFieldValid(description) === true) {
            todo.description = description.value;
        } else {
            errorCounter++;
        }

        let importanceChecked = document.querySelector('input[name = "starValue"]:checked');

        todo.importance = importanceChecked === null ? '' : importanceChecked.value;
        todo.deadline = document.getElementById('datepicker').value;

        return { errorCounter, todo, _id };
    }

    function liveFieldValid(el) {
        el.addEventListener("input", function () {
            isFieldValid(this)
        });
    }

    function isFieldValid(el) {
        if (el.value.length === 0) {
            el.classList.add('error');
            return false;
        } else {
            el.classList.remove('error');
            return true;
        }
    }


    /*-------------------------------------------------------------------
     * Importance Rating Star
     */

    function setImportance(val = 0) {
        let ratingInput = document.getElementsByClassName("rating__input");

        for (let i = 0; i < ratingInput.length; i++) {
            let _this = ratingInput[i];
            if (_this.value === val) {
                _this.checked = true;
                _this.parentElement.classList.add("active");
            } else {
                _this.checked = false;
                _this.parentElement.classList.remove("active");
            }
        }
        document.getElementById("js-rating").addEventListener('click', initImportance, false);
    }

    function initImportance(e) {
        if (e.target.classList.contains('rating__label')) {
            let ratingLabel = document.getElementsByClassName("rating__label");

            for (let i = 0; i < ratingLabel.length; i++) {
                let _this = ratingLabel[i];
                if (_this === e.target) {
                    _this.classList.add('active');
                    _this.firstChild.checked = true;
                } else {
                    _this.classList.remove('active');
                    _this.firstChild.checked = false;
                }
            }
        }
    }


    /*-------------------------------------------------------------------
     * Calender plugin
     */

    function loadDatePicker(val) {

        let _setDefaultDate = val === undefined ? '' : val;
        let picker = new Pikaday({
            field: document.getElementById('datepicker'),
            firstDay: 1,
            minDate: new Date(),
            bound: false,
            container: document.getElementById('datepicker__container'),
            onSelect: function () {
                document.getElementById('js-date-text').innerHTML = this.getMoment().format('D/M/YYYY');
            }
        });
        picker.setDate(_setDefaultDate);
    }


    /*-------------------------------------------------------------------
     * Filter - to sort todos
     */

    function initFilter() {
        let storedFilter = localStorage.getItem('toDoer_filter');

        if (storedFilter === null || storedFilter === '') {
            storedFilter = filterDefault;
            localStorage.setItem("toDoer_filter", filterDefault);
        }
        updateFilterBtn(storedFilter);
        return storedFilter;
    }

    function setFilter(e) {
        if (e.target.classList.contains('js-filter-sort')) {
            let curFilter = '';

            e.target.classList.toggle('selected');

            if (e.target.classList.contains('selected')) {
                curFilter = e.target.dataset.sort;
            }
            localStorage.setItem("toDoer_filter", curFilter);

            showData();
        }
    }

    function updateFilterBtn(storedFilter) {
        let filters = document.getElementsByClassName("js-filter-sort");
        for (let i = 0; i < filters.length; i++) {
            let _this = filters[i];

            if (_this.dataset.sort === storedFilter) {
                _this.classList.add('selected');
            } else {
                _this.classList.remove('selected');
            }
        }
    }

    document.getElementsByClassName("header__nav")[0].addEventListener('click', setFilter, false);


    /*-------------------------------------------------------------------
     *  Status 'finished'  Visiblility
     */

    let filter_showDoneBtn = document.getElementById("js-show-done");
    filter_showDoneBtn.addEventListener('click', setShowDone, false);

    loadShowDone();

    function loadShowDone() {
        let stored_ShowDone = JSON.parse(localStorage.getItem("toDoer_show-done"));
        if (stored_ShowDone === true || stored_ShowDone === null) {
            html.classList.add('show-done');
            filter_showDoneBtn.classList.add('selected');
        } else {
            html.classList.remove('show-done');
            filter_showDoneBtn.classList.remove('selected');
        }
    }

    function setShowDone() {
        this.classList.toggle('selected');
        if (this.classList.contains('selected')) {
            html.classList.add('show-done');
            JSON.stringify(localStorage.setItem("toDoer_show-done", true));
        } else {
            html.classList.remove('show-done');
            JSON.stringify(localStorage.setItem("toDoer_show-done", false));
        }
    }


    /*-------------------------------------------------------------------
     * Status 'finished' Update
     */

    function updateStatus(e) {
        if (e.target.classList.contains('js-todo-status')) {
            let _this = e.target;
            let todoId = _this.dataset.id;
            let status = false;
            let doneDate = false;

            _this.classList.toggle('checked');

            if (_this.classList.contains('checked')) {
                status = true;
                doneDate = new Date();
            }

            let _thisTodo = {isDone: status, doneDate: doneDate};

            client.updateStatus(todoId, _thisTodo).then(function () {
                showData();
            });
        }
    }

    divTodoList.addEventListener('click', updateStatus, false);


    /*-------------------------------------------------------------------
     * Mobile Filter Layer
     */

    let iconMobileGear = document.getElementsByClassName('js-open-mobile-filter')[0];

    iconMobileGear.addEventListener('click', () => {
        html.classList.toggle('mobile-filter--open');
    });

});


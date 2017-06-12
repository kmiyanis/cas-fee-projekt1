/*-------------------------------------------------------------------
 * Variables
 */
let html = document.getElementsByTagName('html')[0];


/*-------------------------------------------------------------------
 * Switch Stylesheet
 */

let themeSwicher = document.getElementById('js-theme-swicher');

function readStyle (){
    "use strict";
    let localStylesheet = localStorage.getItem("stylesheet");
    if(localStylesheet !== null) {
        themeSwicher.value = localStylesheet;
        switchStyle (localStylesheet);
    }
}
function switchStyle (themeSwicher){
    "use strict";

    let newTheme;
    if(themeSwicher.target) {
        newTheme = themeSwicher.target.value;
    } else {
        newTheme = themeSwicher;
    }

    let styles = document.querySelectorAll('[rel*="stylesheet"]:not(#layout)');

    styles.forEach(function(el){
        if(el.dataset.theme === newTheme) {
            el.disabled = false;
            el.setAttribute('rel', 'stylesheet');
            localStorage.setItem("stylesheet",newTheme);
        } else {
            el.disabled = true;
            el.setAttribute('rel', 'stylesheet alternate');
        }
    });
    /* I have to remove title attribute due to chrome,
    *  but firefox view-> stylesheet does not update, when I change stylesheet per JS
    * */
}
document.addEventListener("DOMContentLoaded",readStyle, false);
themeSwicher.addEventListener('change', switchStyle);


/*-------------------------------------------------------------------
 * Mobile Filter
 */

let iconMobileGear = document.getElementsByClassName('js-open-mobile-filter')[0];

iconMobileGear.addEventListener('click', (event) => {
    "use strict";
    html.classList.toggle('mobile-filter--open');
});
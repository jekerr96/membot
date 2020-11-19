import {BasePage} from "./base";

const MainPage = BasePage.extend({
        defaults: {

        }
    },
    {
        init() {
            this._super();

        },
    });

new MainPage(document.querySelector("body"));

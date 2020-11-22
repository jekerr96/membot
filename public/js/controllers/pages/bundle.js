import BasePage from "./base";

const BundlePage = BasePage.extend({
        defaults: {

        }
    },
    {
        init() {
            this._super();

        },
    });

new BundlePage(document.querySelector("body"));

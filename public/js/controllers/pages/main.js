import BasePage from "./base";

const MainPage = BasePage.extend({
        defaults: {
            sendBundleAll: ".js-send-bundle",
            bundleText: ".js-bundle-text",
            bundleId: ".js-bundle-select",
        }
    },
    {
        init() {
            this._super();

        },

        // "{sendBundleAll} click"() {
        //     let bundleText = this.element.querySelector(this.options.bundleText)?.value;
        //     let bundleId = this.element.querySelector(this.options.bundleId)?.value;
        //
        //     $.ajax({
        //         url: "/bot/send-bundle-all/",
        //         method: "POST",
        //         data: {bundleText, bundleId},
        //         success: () => {
        //             console.log("ok"); // TODO remove
        //         },
        //     });
        // }
    });

new MainPage(document.querySelector("body"));

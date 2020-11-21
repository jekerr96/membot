import Control from "can-control";
import "can-construct-super";
import {FormLoader} from "../helper/form-loader";
import Fancybox from "../partials/fancybox";

const BasePage = Control.extend({
    defaults: {}
}, {
    init() {
        FormLoader(this.element);
        new Fancybox(this.element);
    },
});

export default BasePage;

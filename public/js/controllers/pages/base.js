import Control from "can-control";
import "can-construct-super";
import {FormLoader} from "../helper/form-loader";

const BasePage = Control.extend({
    defaults: {}
}, {
    init() {
        FormLoader(this.element);
    },
});

export default BasePage;

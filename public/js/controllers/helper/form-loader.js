export const FormLoader = (node) => {
    console.log(node); // TODO remove
    node.querySelectorAll("form[data-form-type]").forEach(form => {
        let formType = form.dataset.formType;
        let FormController;

        try {
            FormController = require("../forms" + formType);
        } catch (e) {
            FormController = require("../forms/base");
        }

        new FormController.default(form);
        form.dataset.formController = true;
    });
};
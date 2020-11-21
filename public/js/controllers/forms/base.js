const BaseForm = Control.extend(
    {
        defaults: {

        }
    },
    {
        init() {

        },

        "{element} submit"(el, ev) {
            ev.preventDefault();
            let url = this.element.action;
            let data = this.getDataToSend();

            $.ajax({
                url,
                type: "post",
                data,
                processData: false,
                contentType: false,
                success: (data) => {
                    this.successCallback(data);
                },
                error: (data) => {
                    console.error(data);
                }
            });
        },

        getDataToSend() {
            return new FormData(this.element);
        },

        successCallback(data) {
            console.log(data);
        }
    }
);

export default BaseForm;
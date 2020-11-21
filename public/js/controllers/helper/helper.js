export const openInfoPopup = (title, message = "") => {
    $.fancybox.open(`
       <div class="popup" data-popup-type="info">
           <div class="popup-title">${title}</div>
           <div class="popup-message">${message}</div>
           <div class="btn-wrap">
               <a href="javascript:void(0)" data-fancybox-close class="btn">Ок</a>
           </div>
       </div>
    `);
};
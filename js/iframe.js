const el_loader = window.parent.document.querySelector('#cdp_loader');
const el_h1 = window.parent.document.querySelector('h1');
if (el_loader !== null) {
    window.addEventListener('load', function() {
        el_loader.classList.add('u-transparent');
    });
    document.querySelectorAll('#cdp_next_scene, #cdp_prev_scene').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            el_loader.classList.remove('u-transparent');
            const url = e.target.getAttribute('href');
            setTimeout(function() {
                window.location.href = url;
                if (el_h1 !== null) {
                    el_h1.classList.remove('u-transparent');
                }
            }, 500);
        })
    })
}
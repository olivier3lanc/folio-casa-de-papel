const casaDePapel = {
    defaults: {
        firstSceneId: 'cdp_executives'
    },
    // Returns the current scene id
    // Empty string if none
    getCurrentScene: function() {
        const el_active_scene = document.querySelector('main .cdp_scene:not(.u-none)');
        let result = '';
        if (el_active_scene !== null) {
            result = el_active_scene.id;
        }
        return result;
    },
    getNextScene: function() {
        const current_id = this.getCurrentScene();
        const el_current_scene = document.querySelector('#'+current_id);
        let result = '';
        if (el_current_scene !== null) {
            const el_next_scene = el_current_scene.nextElementSibling;
            // If null it is the last scene
            if (el_next_scene === null) {
                result = null;
            } else {
                result = el_next_scene.id;
            }
        }
        return result;
    },
    playNextScene: function() {
        const current_id = this.getCurrentScene();
        const el_current_scene = document.querySelector('#'+current_id);
        if (el_current_scene !== null) {
            const el_next_scene = el_current_scene.nextElementSibling;
            // If null it is the last scene
            if (el_next_scene === null) {

            } else {
                this.playScene(el_next_scene.id);
            }
        }
    },
    playScene: function(id) {
        if (typeof id === 'string') {
            const el_scene = document.querySelector('#'+id);
            if (el_scene !== null) {
                // UI management exceptions for scroll btween
                const els_ui = document.querySelectorAll('#cdp_title, #cdp_nav_thumbnail, #cdp_nav_line_1').forEach(function(el_ui) {
                    scrollBtween.destroy(el_ui.id);
                    if (id == casaDePapel.defaults.firstSceneId) {
                        el_ui.removeAttribute('scroll-btween-disabled');
                        el_ui.setAttribute('scroll-btween', el_ui.id);
                    } else {
                        el_ui.removeAttribute('scroll-btween');
                        el_ui.setAttribute('scroll-btween-disabled', el_ui.id);
                    }
                });
                // Hide and disable all scenes
                document.querySelectorAll('main .cdp_scene').forEach(function(el) {
                    el.classList.add('u-none');
                    el.querySelectorAll('[scroll-frames]').forEach(function(el) {
                        const scroll_frames_id = el.getAttribute('scroll-frames');
                        scrollFrames.destroy(scroll_frames_id);
                        el.removeAttribute('scroll-frames');
                        el.setAttribute('scroll-frames-disabled', scroll_frames_id);
                    });
                    el.querySelectorAll('[scroll-btween]').forEach(function(el) {
                        const scroll_btween_id = el.getAttribute('scroll-btween');
                        scrollBtween.destroy(scroll_btween_id);
                        el.removeAttribute('scroll-btween');
                        el.setAttribute('scroll-btween-disabled', scroll_btween_id);
                    });
                });
                el_scene.querySelectorAll('[scroll-frames-disabled]').forEach(function(el) {
                    const scroll_frames_id = el.getAttribute('scroll-frames-disabled');
                    el.removeAttribute('scroll-frames-disabled');
                    el.setAttribute('scroll-frames', scroll_frames_id);
                });
                el_scene.querySelectorAll('[scroll-btween-disabled]').forEach(function(el) {
                    const scroll_btween_id = el.getAttribute('scroll-btween-disabled');
                    el.removeAttribute('scroll-btween-disabled');
                    el.setAttribute('scroll-btween', scroll_btween_id);
                });
                window.scrollTo({
                    top: 0,
                    left: 0
                });
                // Update view
                scrollBtween.update();
                scrollBtween.updateTweenerValues();
                scrollFrames.update();
                el_scene.classList.remove('u-none');
                // Enable thumbnail
                const el_nav = document.querySelector('#'+id+'_nav');
                if (el_nav !== null) {
                    el_nav.classList.remove('u-pe-none', 'u-faded');
                }
            }
        }
    }
}
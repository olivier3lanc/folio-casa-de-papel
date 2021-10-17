let casaDePapel = {
    defaults: {
        el_audio_player: document.getElementById('cdp_audio_player'),
        el_scene_container: document.querySelector('main'),
        scenes: [
            'cdp_executives',
            'cdp_ursula',
            'cdp_albamiguel',
            'cdp_alvaro',
            'cdp_pacopedro',
            'cdp_migue',
            'cdp_ykiti',
            'cdp_beretta',
            'cdp_cristina',
            'cdp_esther',
            'cdp_final'
        ]
    },
    scenesElements: {},
    playPauseAudio: function() {
        if (this.defaults.el_audio_player !== null) {
            if (this.defaults.el_audio_player.paused) {
                this.defaults.el_audio_player.play();
            } else {
                this.defaults.el_audio_player.pause();
            }
        }
    },
    playScene: function(id) {
        if (Object.keys(this.scenesElements).length > 0 && this.defaults.el_scene_container !== null) {
            // console.log('1st');
            if (typeof this.scenesElements[id] == 'object') {
                // console.log('2nd');
                const el_current_scene = this.defaults.el_scene_container.querySelector('iframe');
                if (el_current_scene !== null) {
                    console.log(el_current_scene);
                    this.defaults.el_scene_container.removeChild(el_current_scene);
                }
            }
        }
    },
    update: function() {
        // if (this.defaults.scenes !== undefined && Object.keys(this.scenesElements).length == 0) {
        //     this.defaults.scenes.forEach(function(scene_id) {
        //         casaDePapel.scenesElements[scene_id] = document.createElement('iframe');
        //         casaDePapel.scenesElements[scene_id]['src'] = scene_id+'.html';
        //         casaDePapel.scenesElements[scene_id].classList.add('c-position', 'm-fixed', 'm-top-0', 'u-w-100', 'u-h-100vh', 'u-brep-no-repeat', 'u-bpos-center', 'u-m-none', 'u-p-none', 'u-b-none');
        //     });
        // }
    }
}
casaDePapel.update();
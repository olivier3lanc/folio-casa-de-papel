let casaDePapel = {
    defaults: {
        el_audio_player: document.getElementById('cdp_audio_player'),
        el_play_pause_button: document.getElementById('cdp_play_pause'),
        el_nav_home: document.getElementById('cdp_nav_home'),
        el_loader: document.getElementById('cdp_loader'),
        el_scenes: document.getElementById('cdp_scenes'),
        el_audio_consent_modal: document.getElementById('cdp_audio_consent_modal'),
    },
    audioConsentModal: function(cmd) {
        if (typeof cmd == 'string') {
            if (cmd == 'close') {
                this.defaults.el_audio_consent_modal.classList.add('u-none');
            }
            if (cmd == 'open') {
                this.defaults.el_audio_consent_modal.classList.remove('u-none');
            }
        }
    },
    playPauseAudio: function() {
        if (this.defaults.el_audio_player !== null && this.defaults.el_play_pause_button !== null) {
            if (this.defaults.el_audio_player.paused) {
                this.defaults.el_audio_player.play();
                this.defaults.el_play_pause_button.innerHTML = 'Pause';
                window.cdp_audio_player_paused = false;
            } else {
                this.defaults.el_audio_player.pause();
                this.defaults.el_play_pause_button.innerHTML = 'Play';
                window.cdp_audio_player_paused = true;
            }
        }
    },
    update: function() {
        window.cdp_audio_player_paused = true;
        window.addEventListener('load', function() {
            document.body.style.opacity = 1;
        });
        if (this.defaults.el_nav_home !== null && this.defaults.el_loader !== null && this.defaults.el_scenes !== null) {
            this.defaults.el_nav_home.addEventListener('click', function(e) {
                e.preventDefault();
                casaDePapel.defaults.el_loader.classList.remove('u-transparent');
                setTimeout(function() {
                    casaDePapel.defaults.el_scenes.setAttribute('src', 'cdp_executives.html');
                }, 500);
            })
        }
    }
}
casaDePapel.update();
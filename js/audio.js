const player = new Plyr('#player', {
    controls: ['play', 'volume'],
});
const playerTrig = function(e) {
    document.removeEventListener('scroll', playerTrig);
    console.log('kjk');
    player.play();
}
document.addEventListener('scroll', playerTrig);
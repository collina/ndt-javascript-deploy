angular.module('Measure.GaugeService', [])

.factory('ProgressGauge', function() {
  var aProgress = document.getElementById('activeProgress');

  function setInactive() {
    var barCTX = aProgress.getContext("2d");
    drawProgress(1);
    barCTX.strokeStyle = '#ACA3CF';
    barCTX.stroke();
  }
  function resetProgress() {
    // drawProgress(0);
    setInactive();
  }
  function drawProgress(percentage){
    var barCTX = aProgress.getContext("2d");
    var quarterTurn = Math.PI / 2;
    var endingAngle = ((2*percentage) * Math.PI) - quarterTurn;
    var startingAngle = 0 - quarterTurn;


    aProgress.width = aProgress.width;
    barCTX.lineCap = 'square';

    barCTX.beginPath();
    barCTX.lineWidth = 20;
    barCTX.strokeStyle = '#FFFFFF';
    barCTX.arc(137.5,137.5,111,startingAngle, endingAngle);
    barCTX.stroke();
  }

  return {
    "element": aProgress,
    'reset': resetProgress,
    'progress': drawProgress
  };


});

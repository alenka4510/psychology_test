$(document).ready(function () {
  const AMOUNT_TIME_FOR_TEST_IN_SECONDS = 15;
  const AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS = 3 * 1000;
  const KEYCODE_LEFT_BUTTON = 37;
  const KEYCODE_RIGHT_BUTTON = 39;
  const FILE_TYPE_AUDIO = 'audio';
  const testCountdownElement = $('#test_countdown');
  const leftButton = $('.leftBtn');
  const rightButton = $('.rightBtn');
  const myAudio = new Audio;

  let testStartTime;
  let leastTimeForTest = AMOUNT_TIME_FOR_TEST_IN_SECONDS;
  let nextTaskTimeout;
  let currentFile = {};
  let rightAnswers = 0;
  let testIsEnded = false;

  //начать тестирование
  $('#play').on('click', startTest);

  function startTest() {
    $(this).fadeOut(500);
    $('#b1').delay(1000).fadeIn(300);
    $('.next').delay(1000).fadeIn(300);
  }

  function initTestCountdown() {
    testStartTime = new moment();
    renderTestCountdown();
    testCountdown();
  }

  function renderTestCountdown() {
    testCountdownElement.html(`Least ${leastTimeForTest} seconds`);
  }

  function testCountdown() {
    const countdownInterval = setInterval(() => {
      leastTimeForTest = leastTimeForTest - 1;
      renderTestCountdown();
      if (leastTimeForTest <= 0 ) {
        clearInterval(countdownInterval);
        onTestCountdownEnded();
      }
    }, 1000)
  }

  function onTestCountdownEnded() {
    testIsEnded = true;
    if (nextTaskTimeout) {
      clearTimeout(nextTaskTimeout);
    }

    if (currentFile && currentFile.type === FILE_TYPE_AUDIO) {
      myAudio.pause();
    }

    $('#result').html(`right answers count: ${rightAnswers}`);
    console.log('test time ended');
  }

  $('#next').on('click', function () {
    initTestCountdown();
    initEventListeners();
    const { images, tasks, audios } = getDataTest();
    // TODO: refactor this function
    hideAndShowElements();

    index = 0;							//индекс задачи
    var col = 20;						//количество тасков
    var level = $('#levels').val();		//уровень теста

    nextTask();

    function initEventListeners() {
      document.addEventListener("keydown", onKeyDown);
      leftButton.on('click', checkLeftButtonAnswer);
      rightButton.on('click', checkRightButtonAnswer);
    }

    function checkLeftButtonAnswer() {
      checkAnswerProcess(0);
    }

    function checkRightButtonAnswer() {
      checkAnswerProcess(1);
    }

    function checkAnswerProcess(answer) {
      if (checkAnswer(answer)) {
        rightAnswers++;
      }

      clearTimeout(nextTaskTimeout);
      nextTask();
    }

    function nextTaskLevel2(myAudio, btnFlag) {
      if (myAudio != null)
        myAudio.pause();

      index = selfRandom(0, images.length - 1);
      indexAudio = selfRandom(0, images.length - 1);

      clearTaskImage

      var taskImg = images[index].fileName;
      var taskAudio = audios[indexAudio].fileName;

      if (taskImg == null) {
        return;
      }

      addTaskImage(taskImg);

      playAudio(taskAudio);

    }

    function checkAnswer(btnFlag) {
      console.log({ btnFlag, index, tasks: tasks[index] });
      const prevTask = tasks[index];
      return btnFlag === prevTask.fl;
    }

    function onKeyDown(e) {
      switch (e.keyCode) {
        case KEYCODE_LEFT_BUTTON: {
          leftButton.click();
          break;
        }

        case KEYCODE_RIGHT_BUTTON: {
          rightButton.click();
          break;
        }

        default: {
          break;
        }
      }
    }

    //Новая задача
    function nextTask() {
      if (testIsEnded) {
        return;
      }

      if (currentFile && currentFile.type === FILE_TYPE_AUDIO) {
        myAudio.pause();
      }

      clearTaskImage();
      resetCurrentFile();
      index = selfRandom(0, tasks.length - 1);

      const taskFile = tasks[index].fileName;
      if (taskFile === null) {
        return;
      }

      let taskFileImage = taskFile;
      if (taskFile.split('.')[1] === 'mp3') {
        playAudio(taskFile);
        taskFileImage = './audio.jpg';
        currentFile = { type: FILE_TYPE_AUDIO, val: taskFile };
      }

      addTaskImage(taskFileImage);
      nextTaskTimeout = setTimeout(nextTask, AMOUNT_TIME_FOR_TASK_IN_MILLISECONDS);
    }

    function clearTaskImage() {
      $('#task').empty();
    }

    function resetCurrentFile() {
      currentFile = {};
    }

    function addTaskImage(img) {
      $('#task').prepend('<img id="ImgTask" src="' + img + '" width="500" height="300" />');
    }

    function runTest() {
      nextTask();


      /*$('.left').prop('disabled', true);
       $('.right').prop('disabled', true);
       alert("Тест закончен, количество правильных ответов " + rightAnswers);
       return;*/

    }

    function playAudio(fileName) {
      myAudio.src = fileName;
      myAudio.play();
    }
  });


  function selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //получить данные теста (задания)
  function getDataTest() {
    var tasks = new Array(
      {fileName: 'taskC1.jpg', fl: 0},
      {fileName: 'taskC2.jpg', fl: 0},
      {fileName: 'taskC3.jpg', fl: 0},
      {fileName: 'taskC4.jpg', fl: 0},
      {fileName: 'taskD5.jpg', fl: 1},
      {fileName: 'taskD6.jpg', fl: 1},
      {fileName: 'taskD7.jpg', fl: 1},
      {fileName: 'taskD8.jpg', fl: 1},
      {fileName: '01001.mp3', fl: 1},
      {fileName: '04453.mp3', fl: 0},
      {fileName: '01004.mp3', fl: 1},
      {fileName: '00988.mp3', fl: 0}
    );

    var images = new Array(
      {fileName: 'taskC1.jpg', fl: 0},
      {fileName: 'taskC4.jpg', fl: 0},
      {fileName: 'taskD5.jpg', fl: 1},
      {fileName: 'taskD8.jpg', fl: 1}
    );

    var audios = new Array(
      {fileName: '01001.mp3', fl: 1},
      {fileName: '04453.mp3', fl: 0},
      {fileName: '01004.mp3', fl: 1},
      {fileName: '00988.mp3', fl: 0}
    );

    return {
      tasks: tasks,
      images: images,
      audios: audios
    };
  }

  function hideAndShowElements() {
    $('#b1').fadeOut(500);
    //$(this).fadeOut(500);
    $('#three').delay(1000).fadeIn(500);
    $('#three').delay(500).fadeOut(500);
    $('#two').delay(2500).fadeIn(500);
    $('#two').delay(500).fadeOut(500);
    $('#one').delay(4000).fadeIn(500);
    $('#one').delay(500).fadeOut(500);
    $('.info').delay(4500).fadeOut(500);

    $('.leftBtn').delay(1000).fadeIn(500);
    $('.rightBtn').delay(1000).fadeIn(500);
    $('#task').delay(1000).fadeIn(500);
    $('#ans').delay(1000).fadeIn(500);
  }


  /*setTimeout(function()
   {
   var data=$(".result").html();
   level1=data.indexOf("first") + 1;
   level2=data.indexOf("second") + 1;
   level3=data.indexOf("third") + 1;
   $('.wrap').fadeIn(500);
   $('.attempt b').text(atm);

   if(level1!=0)
   {
   end=7;
   $('#circle').text(0+'/'+(end-3));
   max=15;
   print_table(4);
   test();
   }
   if(level2!=0)
   {
   end=11;
   $('#circle').text(0+'/'+(end-3));
   max=24;
   print_table(5);
   test();
   }
   if(level3!=0)
   {
   end=14;
   $('#circle').text(0+'/'+(end-3));
   max=35;
   print_table(6);
   test();
   }
   },5500); */
});

function getAjax() {
  $.ajax(
    {
      url: "level1.php",
      type: "POST",
      data: {
        act: $('#levels').val()

      },
      success: function (data) {
        $(".result").append(data);
      }
    });
}

ThisQuiz = new Mongo.Collection("quizzes");
ThisResponse = new Mongo.Collection("responses");
var q=0;
if (Meteor.isClient) {
      var updateTimeLeft;
      Template.signupForm.events({
    'submit #signup-form': function(e,t){
      e.preventDefault();

      var input=t.find('#signup-password').value;
      var input2=t.find('#signup-confirm').value;
      if(input.length<4 || input.length> 8)  
          {   
          alert("Please input the password between " +4+ " and " +8+ " characters");  
                return false;  
          }  
        else{
            if(input!=input2){
              alert("Password Mismatch");
            }

            else{
      Accounts.createUser({
        username:t.find('#signup-username').value,
        password:t.find('#signup-password').value,
        email:t.find('#signup-email').value,
        profile:{
          confirm:t.find('#signup-confirm').value,
          current_response_id:""
        }

      });
      
      t.find('#signup-username').value = "";
      t.find('#signup-password').value = "";
      t.find('#signup-email').value = "";
      t.find('#signup-confirm').value = "";
      //console.log("signed up");
    //  Meteor.logout();
          }
      }
    }
  });

 Template.loginForm.events({
    'submit #login-form': function(e,t) {
      e.preventDefault();

       var unam=t.find('#login-username').value;
       var password=t.find('#login-password').value;
     
         Meteor.loginWithPassword(unam,password);
    }
});


  var quizQuestions = [];

  changeAnswer = function(question){
     Meteor.call("getResponse", question, function(error, result){
      if (error)
        console.log(error.reason);
      else {
        if (result)
          $('input[name=questionAnswer][value=' + result + ']').prop('checked',true);
        else
          $('input[name=questionAnswer]').prop('checked',false);
      }
    });
  }

  /* **************************************************************************************************** */

  Template.questionSelect.onCreated( function() {
    this.time_left = new ReactiveVar(1200);
    Session.clear('updateTimeLeft');
  });

  Template.waiting_time.onCreated( function() {
    this.time_left = new ReactiveVar(300);
    Session.clear('updateWaitingTimeLeft');
  });

  Template.questionSelect.onRendered( function() {
    clearInterval(Session.get('updateTimeLeft'));
    var self = this;

    Meteor.call("getQuiz", function(error, result){
      if (error)
        console.log(error.reason);
      else {
        quizQuestions = result;
        Session.set('selectedQuestion', '1');
        changeAnswer('1');
      }
    });



    Meteor.call("getTimer", function(error, result){
      if (error)
        console.log(error.reason);
      else {
        self.time_left.set(result);
      }
    });

    updateTimeLeft = setInterval( function() {
      self.time_left.set(self.time_left.get() - 1);
      Meteor.call('setTimer', self.time_left.get());
    } , 1000 );
    Session.setPersistent('updateTimeLeft', updateTimeLeft);
    //setTimeLeft =  setInterval( function() {Meteor.call('setTimer', self.time_left.get())} , 5000 );
    //Session.set('updateTimeLeft', updateTimeLeft);
    //Session.set('setTimeLeft', setTimeLeft);
  });

  Template.questionSelect.onDestroyed(function() {
    //console.log('Naman');
    clearInterval('updateTimeLeft');
  });

  Template.waiting_time.onDestroyed(function() {
    //console.log('Naman');
    clearInterval('updateWaitingTimeLeft');
    Session.clear('subscribed');
  });

  Template.waiting_time.onRendered( function() {
    clearInterval(Session.get('updateWaitingTimeLeft'));
    var self = this;

    Meteor.call("getWaitingTimer", function(error, result){
      if (error)
        console.log(error.reason);
      else {
        self.time_left.set(result);
      }
    });

    updateWaitingTimeLeft = setInterval( function() {
      self.time_left.set(self.time_left.get() - 1);
      Meteor.call('setWaitingTimer', self.time_left.get());
    } , 1000 );
    Session.set('updateWaitingTimeLeft', updateWaitingTimeLeft);
    // Session.set('updateTimeLeft', updateTimeLeft);
    // Session.set('setTimeLeft', setTimeLeft); 

  });
  Template.waiting_time.events({
   
      'click #logoutbtn': function() {
     Meteor.call('endquiz',Meteor.userId());
     clearInterval(Session.get('updateWaitingTimeLeft'));
     clearInterval(Session.get('updateTimeLeft'));
     Session.clear('final_answer');
     Session.clear('subscribed');
      Meteor.logout();

    }
  }); 
  

  Template.questionSelect.events({
    'click input': function( event,template ) {
      Session.set('selectedQuestion', event.target.value);
      changeAnswer(event.target.value);
    }
  });

  Template.online.helpers({
    'showGroupQuizzes': function() {
      var groupQuizzes = ThisResponse.find({type: 'Group'}).fetch();
      var time = new Date();
      for(i = 0; i < groupQuizzes.length; i++) {
        // var date = new Date(Date.parse(time) - Date.parse(groupQuizzes[i].createdAt));
        // if(date.getMinutes() > 30) {
        //   groupQuizzes.splice(i, 1);
        // }
        if(groupQuizzes[i].waiting_time <= 0) {
          console.log('Hello');
          groupQuizzes.splice(i, 1);
        }
    }
    return groupQuizzes;
  },
    'totalGroupQuizzes': function() {
      var groupQuizzes = ThisResponse.find({type: 'Group'}).fetch();
      var time = new Date();
      for(i = 0; i < groupQuizzes.length; i++) {
        // var date = new Date(Date.parse(time) - Date.parse(groupQuizzes[i].createdAt));
        // if(date.getMinutes() > 30) {
        //   groupQuizzes.splice(i, 1);
        // }
        if(groupQuizzes[i].waiting_time <= 0) {
          groupQuizzes.splice(i, 1);
        }
    }
    return groupQuizzes.length > 0;
    }
});

  Template.online.events({
    'click input': function() {
      event.preventDefault();
      // var quizID = $(event.target).attr('id');
      // var userID = $(event.target).attr('name');
      var responseID = $(event.target).attr('id');
      var subscribed = $(event.target).attr('value');
      console.log(subscribed);
      Session.setPersistent('subscribed', subscribed);
      // var category = ThisResponse.find({userID: userID, quizID: quizID}).fetch()[0].category;
      // var timeLeft = ThisResponse.find({userID: userID, quizID: quizID}).fetch()[0].waiting_time;
      // console.log(quizID+"  "+userID+"  "+category+"  "+timeLeft+"  "+responseID);
      Meteor.call('setGroupResponseId', responseID);
    }
  });

  Template.questionSelect.helpers({
    time_left: function() {
      var time = Template.instance().time_left.get();
      Session.set('timeLeft', time);
      var minutes = ((Math.floor(time/60) < 10) ? '0' : '') + Math.floor(time/60);
      var seconds = ((time%60 < 10) ? '0' : '') + (time%60);
      if(time <= 0) {
       clearInterval(Session.get('updateWaitingTimeLeft'));
     clearInterval(Session.get('updateTimeLeft'));
     Session.clear('final_answer')
     Session.clear('subscribed');
      }
      return minutes+":"+seconds;
    },
     'ended': function() {
       return Session.get('timeLeft') <= 0;
     }
  }); 

  Template.waiting_time.helpers({
    time_left: function() {
      var time = Template.instance().time_left.get();
      Session.set('timeLeft', time);
      var minutes = ((Math.floor(time/60) < 10) ? '0' : '') + Math.floor(time/60);
      var seconds = ((time%60 < 10) ? '0' : '') + (time%60);
      if(time <= 0) {
        clearInterval(Session.get('updateWaitingTimeLeft'));
     clearInterval(Session.get('updateTimeLeft'));
     Session.clear('final_answer')
     Session.clear('subscribed');
      }
      return minutes+":"+seconds;
    }
  }); 

  /* **************************************************************************************************** */
  
  Template.questionShow.events({
    'click input': function( event,template ) {
      Meteor.call('setResponse', parseInt(Session.get('selectedQuestion')) , event.target.value );
    },
    'click #logoutbtn': function() {
     Meteor.call('endquiz',Meteor.userId());
     clearInterval(Session.get('updateWaitingTimeLeft'));
     clearInterval(Session.get('updateTimeLeft'));
     Session.clear('final_answer')
     Session.clear('subscribed');
      Meteor.logout();

    },
     'click #onsubmitbutton' :function(){

      var final_answer = $('#onsubmitbutton').attr('value');
      Session.setPersistent('final_answer',final_answer);
      console.log("going Here");
      Meteor.call("getQuestionSet", function(error, result){
      if (error){
       
        console.log(error.reason);
        
      }
      else {
      
        Session.set('selectedScore', result);
        console.log(Session.get('selectedScore'));     
      }
    });

      Meteor.call("getResponseSet", function(error, result){
      if (error){
        //console.log("Chu");
        console.log(error.reason);
        
      }
      else {
        Session.set('selectedScore1', result);
       console.log(Session.get('selectedScore1'));
      }
    });

      Meteor.call("getActualScore", function(error, result){
      if (error){
        
        console.log(error.reason);
        
      }
      else {
      
        Session.set('selectedScore2', result);
        console.log(Session.get('selectedScore2'));
        console.log("aaasssssss"+ Session.get('selectedScore2'));
      }
    });
      Router.go('scoreCard');
  }
  }); 

  Template.questionShow.helpers({
    questionData: function() {
      return quizQuestions[parseInt(Session.get('selectedQuestion')) - 1];
    },

   'showSubmitButton': function() {
    return Session.get('selectedType') === 'Individual' || ThisResponse.findOne(Meteor.users.findOne(Meteor.user()).profile.current_response_id).time_left <= 0;  
   }
  });   

  /* **************************************************************************************************** */

  Template.quizSelect.events({  
    "submit .quizParameters": function (event) {
      event.preventDefault();
      var selectedType =  event.target.quizType.value;
      var selectedCategory =  event.target.quizCategory.value;
      Session.setPersistent('selectedType', selectedType);
      Meteor.call("createResponse", selectedType, selectedCategory);
    },
    'click #logoutbtn': function() {
      Meteor.call('endquiz',Meteor.userId());
     clearInterval(Session.get('updateWaitingTimeLeft'));
     clearInterval(Session.get('updateTimeLeft'));
     Session.clear('final_answer')
     Session.clear('subscribed');
      Meteor.logout();
    }

  });

 Template.scoreCard.events({  
   
    'click #logoutbtn': function() {
      Meteor.call('endquiz',Meteor.userId());
     clearInterval(Session.get('updateWaitingTimeLeft'));
     clearInterval(Session.get('updateTimeLeft'));
     Session.clear('final_answer')
     Session.clear('subscribed');
      Meteor.logout();
    }

  });


  Template.scoreCard.helpers({
 
  questionData: function(){
   
     var arr1=[];
    var arr2=[];
    var arr3=[];
    var arr4=[];
    var arr5=[];
     var arr6=[];
     var arr7 = [];
     var arr8=[];
     var arrayFinal = [];
    for(var i=0;i<2;i++)
    {
      arr1[i]=Session.get('selectedScore')[i].question;
    //  console.log('arr1 '+arr1[i]);
      arr2[i]=Session.get('selectedScore')[i].option1;
      arr3[i]=Session.get('selectedScore')[i].option2;
      arr4[i]=Session.get('selectedScore')[i].option3;
      arr5[i]=Session.get('selectedScore')[i].option4;
      arr6[i]=Session.get('selectedScore')[i].answer;
   //   console.log('arr2 '+arr2[i]);
       arr7[i]=Session.get('selectedScore1')[i+1];

       arr8[i]=Session.get('selectedScore2')[i];
  //console.log('arr8 '+arr8[i]);
       var obj  = {arr1: arr1[i] , arr2: arr2[i], arr3: arr3[i], arr4: arr4[i], arr5: arr5[i], arr6: arr6[i], arr7: arr7[i], arr8: arr8[i]};
       arrayFinal.push(obj);


     }

     console.log("here....................",arrayFinal);
     //return {k1 : Session.get('selectedScore')[0], k2 : Session.get('selectedScore1')[1]};
     console.log('final............. '+arrayFinal[0].arr1);
     return arrayFinal;
    //return {question : 'Hi', option1: 'Hellow'};
  },

  'getTotalScore': function() {
    return Session.get('selectedScore2')[2];
  }

  }); 

  /* **************************************************************************************************** */
}

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// Router.route('/scoreCard',{
// name:'scoreCard',
// template:'scoreCard'
// });

Router.route('/', function () {
  if (! Meteor.userId()) { 
    this.render('appBody', {to:"template1"});
    this.render('emptyTemplate', {to:"template2"}); 
  }
  else if (Meteor.user().profile.current_response_id == '') {
    this.render('emptyTemplate', {to:"template1"});
    this.render('quizSelect', {to:"template2"});
  }
  else if((Session.get('subscribed') === 'Subscribe' || (Session.get('selectedType') === 'Group')) && ThisResponse.findOne(Meteor.users.findOne(Meteor.user()).profile.current_response_id).waiting_time > 0)  {
       this.render('emptyTemplate', {to:"template1"});
       this.render('waiting_time', {to:"template2"});
       //Session.set('subscribed', '');      
  }

  else if(ThisResponse.findOne(Meteor.users.findOne(Meteor.user()).profile.current_response_id).time_left <= 0 || Session.get('final_answer')==='submit'){
    if(Session.get('final_answer')==='submit') {
      this.render('scoreCard',{to:"template1"});
      this.render('emptyTemplate', {to:"template2"});
   }
     // Session.clear('selectedType');
     // Meteor.users.update(Meteor.user(), {$set: {"profile.current_response_id": "" }});
     clearInterval('updateTimeLeft');    
     clearInterval('updateWaitingTimeLeft');
  }
  else{
     // this.render('emptyTemplate', {to:"template1"});
     //  this.render('waiting_time', {to:"template2"}); 
    this.render('questionSelect', {to:"template1"});
     this.render('questionShow', {to:"template2"});

  }
 // // console.log("route "+ nik);
 //  if (! Meteor.userId()) { 
 //    this.render('login', {to:"template1"});
 //    this.render('emptyTemplate', {to:"template2"}); 
 //  }
 //  else{
 //    this.render('scoreCard',{to:"template1"});
 //    this.render('emptyTemplate', {to:"template2"});
 //  }

});

  /* **************************************************************************************************** */

if(Meteor.isServer){
var previousValue = 0;
Meteor.methods({



  getResponseSet: function (){
    

  var responseID = Meteor.user().profile.current_response_id;
 
  var response = ThisResponse.findOne(responseID);
 
  var userId = Meteor.userId();
 
  console.log('User '+userId);
  
  var answer = eval('response.answers.' + userId);
  //var answer = response.answers.userId;
console.log(answer);
  return answer;


  },

  getQuestionSet: function(){
  
   var responseID = Meteor.user().profile.current_response_id;

  var response = ThisResponse.findOne(responseID);
  var userId = Meteor.userId();
  
 
   var currentQuiz=response.quizID;

  var correctOption=(ThisQuiz.findOne(currentQuiz));
  var quizQuestions = correctOption.quiz;
  return quizQuestions;
  
},

  getActualScore: function(){
  var responseID = Meteor.user().profile.current_response_id;
  var eachScore = [];
  
  var response = ThisResponse.findOne(responseID);
  var userId = Meteor.userId();
  
  var answer = eval('response.answers.' + userId);
//   var answer = response.answers.userId;
   var currentQuiz = response.quizID;

  var correctOption= ThisQuiz.findOne(currentQuiz);
  var quizQuestions = correctOption.quiz;
 
  var cor_array=[];
  var score=0;

  for(var i=0;i<2;i++){
    var correct=correctOption.quiz[i];
    var cor=correct.answer;
    var p='option'+cor;
  
    var cor='option'+cor;
    cor_array[i]=eval('correct.'+p);
    console.log(cor_array[i]);

  
  }
 
  for(var i=0;i<2;i++)
  {
    if(answer[i+1]===cor_array[i])
    {
      eachScore[i] = 10;
      score+=10;
    
    }

    else{
      eachScore[i] = 0;
    }
  }

  response.score.userId = score;
  eachScore[2] = score;
 // console.log('b..............'+eachScore[2]);
  //Session.set('score', score);
  //console.log(response.score.userId);


  return eachScore;
},



  getQuiz: function (){
    var responseID = Meteor.user().profile.current_response_id;
    var quizID = ThisResponse.findOne(responseID).quizID;
    var randomQuiz = ThisQuiz.findOne(quizID);
    var quizQuestions = randomQuiz.quiz;
    for (var i=0 ; i<quizQuestions.length ; i++){
      delete quizQuestions[i]["answer"];
    }
    return quizQuestions;
  },

  getRandomQuizID: function(category){
    var randomQuiz = ThisQuiz.find({category:category}).fetch();
    var index = Math.floor(Math.random() * randomQuiz.length);
    if(index === previousValue) {
      index = (index + 1) % randomQuiz.length;
      previousValue = index;
    }
    //console.log(index);
    randomQuiz = randomQuiz[index];
    return randomQuiz._id;
  },

  createResponse: function(type, category){
  
    if (! Meteor.userId()) { throw new Meteor.Error('not-authorized'); }

    var quizID = Meteor.call('getRandomQuizID', category);

    var responseID = ThisResponse.insert({
      userID: [Meteor.userId()],
      category:category,
      quizID: quizID,
      type: type,
      answers: {[Meteor.userId()]: {}},
      time_left: 60,
      waiting_time: 60,
      score: {},
      conductedAt: new Date()
    });

    Meteor.users.update(Meteor.user(), {$set: {"profile.current_response_id": responseID }});
  },

  setResponse: function (question, answer){
    var responseID = Meteor.user().profile.current_response_id;
    var user = Meteor.userId();
    ThisResponse.update(responseID, {$set: {['answers.' + user + '.' + question]: answer}});
  },

  getResponse: function(question){
    var responseID = Meteor.user().profile.current_response_id;
    var user = Meteor.userId();
    var response = ThisResponse.findOne(responseID).answers;
    var answer = eval('response.' + user + '[' + question + ']');
    return answer;
  },

  setTimer: function(new_time){
    var responseID = Meteor.user().profile.current_response_id;
    var response = ThisResponse.findOne(responseID);
    if (response.time_left > new_time)
      ThisResponse.update(response._id, {$set: {time_left: new_time}});
  },

  getTimer: function(){
    var responseID = Meteor.user().profile.current_response_id;
    return ThisResponse.findOne(responseID).time_left;
  },
  endquiz:function(id){
   Meteor.users.update({ _id:id},{$set:{"profile.current_response_id":""}});
  },

  setWaitingTimer: function(new_time){
    var responseID = Meteor.user().profile.current_response_id;
    var response = ThisResponse.findOne(responseID);
    if (response.waiting_time > new_time)
      ThisResponse.update(response._id, {$set: {waiting_time: new_time}});
  },

  getWaitingTimer: function(){
    var responseID = Meteor.user().profile.current_response_id;
    return ThisResponse.findOne(responseID).waiting_time;
  },

  'setGroupResponseId': function(responseID) {
    Meteor.users.update(Meteor.user(), {$set: {"profile.current_response_id": responseID }});      
  }

});
}
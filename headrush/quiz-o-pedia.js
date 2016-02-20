if (Meteor.isClient) {
  Template.signupForm.events({
    'submit #signup-form': function(e,t){
      e.preventDefault();


      Accounts.createUser({
        username:t.find('#signup-username').value,
        password:t.find('#signup-password').value,
        email:t.find('#signup-email').value,
        profile:{
          fullname:t.find('#signup-name').value
        }

      });
      t.find('#signup-username').value = "";
      t.find('#signup-password').value = "";
      t.find('#signup-email').value = "";
      t.find('#signup-name').value = "";
      console.log("signed up");
    }
  });
Template.logoutForm.events({
    'click .btn': function() {
      Meteor.logout();
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


}


if (Meteor.isServer) {
  Meteor.startup(function () {
   
  });
}
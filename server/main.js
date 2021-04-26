import { Meteor } from 'meteor/meteor';
import { RolesCollection } from '/imports/api/roles';
 
Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (Meteor.roles.find().count() === 0) {

    // General Roles
    Roles.createRole('view');
    Roles.createRole('add');
    Roles.createRole('edit');
    Roles.createRole('delete');
    // Admin Roles & Permissions
    Roles.createRole('admin');
    Roles.addRolesToParent('view', 'admin');
    Roles.addRolesToParent('add', 'admin');
    Roles.addRolesToParent('edit', 'admin');
    Roles.addRolesToParent('delete', 'admin');
    // Editor Roles & Permissions
    Roles.createRole('editor');
    Roles.addRolesToParent('view', 'editor'); 
    Roles.addRolesToParent('edit', 'editor'); 
    // User Roles & Permissions
    Roles.createRole('user');
    Roles.addRolesToParent('view', 'user');  
 
  }

  if (Meteor.users.find().fetch().length === 0) {

    console.log('Creating users: ');

    var users = [
        {name:"Normal User",email:"user@gmail.com",roles:['user']},
        {name:"Editor User",email:"editor@gmail.com",roles:['editor']},
        {name:"Admin User",email:"admin@gmail.com",roles:['admin']}, 
      ];

    users.forEach(function (userData) {
      var id,
          user;

      console.log(userData);

      id = Meteor.users.insert({
        email: userData.email,
        password: "demo",
        profile: { name: userData.name }
      });

      // email verification
      Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});

      userData.roles.forEach(function (role) {
        Roles.createRole(role, {unlessExists: true});
      });

      Roles.addUsersToRoles(id, userData.roles);

    });
  }
});

Meteor.publish("userList", function () {
  return Meteor.users.find({});
});

Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
})

 Meteor.methods({
   removePermission:function(data){ 
    if(data.status){
        Roles.removeRolesFromParent(data.permission, data._id);
    }else{
        Roles.addRolesToParent(data.permission, data._id);
    }
   }
 })
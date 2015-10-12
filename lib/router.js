Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
  }
});

Router.route('/', {name: 'postsList'});

Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {name: 'postSubmit'});

Router.route('/feed.xml', {
  where: 'server',
  name: 'rss',
  action: function() {
  var feed = new RSS({
      title: "New Microscope Posts",
      description: "The latest posts from Microscope, the smallest news aggregator."
    });
    this.response.write(feed.xml());
     this.response.end();
  }
});

var requireLogin = function() {
  if (! Meteor.user()) {
   if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}
if (Meteor.isClient){
  Router.onBeforeAction('dataNotFound', {only: 'postPage'});
  Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
}
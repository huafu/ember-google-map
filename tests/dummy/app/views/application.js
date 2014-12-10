import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function () {
    this.$('> h3').each(function () {
      var $el = Ember.$(this);
      $el.addClass('collapsed');
      $el.next().addClass('collapsed');
    });
  },
  click:            function (event) {
    if (event.target.tagName === 'H3') {
      var $el = this.$(event.target);
      $el.toggleClass('expanded').toggleClass('collapsed');
      $el.next().toggleClass('expanded').toggleClass('collapsed');
    }
  }
});

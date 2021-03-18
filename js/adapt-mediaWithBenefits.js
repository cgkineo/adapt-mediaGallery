define([
  'core/js/adapt',
  './mwbModel.js',
  './mwbView.js'
], function(Adapt, MediaWithBenefitsModel, MediaWithBenefitsView) {

  return Adapt.register('mediawithbenefits', {
    model: MediaWithBenefitsModel,
    view: MediaWithBenefitsView
  });

});

import { Meteor } from 'meteor/meteor';

const devLoader = async () => {
  const { PUBLIC_SETTINGS: settings } = JSON.parse(
    (await (await fetch('/meteor/meteor_runtime_config.js')).text()).slice(28, -1)
  );

  Meteor.settings.public = settings;
  window.run();
};

devLoader();

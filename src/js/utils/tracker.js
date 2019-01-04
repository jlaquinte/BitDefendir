/* Wrapper class to send tracking events to Google Analytics */

class Tracker {

  constructor(opts = {}) {
    this.options = opts
  }

  customTrack(_eventCategory, _eventAction, _eventLabel){
    console.log('Custom Track: eventCategory - '+_eventCategory+' | eventAction - '+_eventAction+' | eventLabel - '+_eventLabel);
    ga('send', { hitType: 'event', eventCategory: _eventCategory, eventAction: _eventAction, eventLabel: _eventLabel });
  }
}

export default Tracker
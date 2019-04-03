var EventLogger = require('node-windows').EventLogger;

var log = new EventLogger('NodeRFC');

log.info('Basic information.');
log.warn('Watch out!');
log.error('Something went wrong.');
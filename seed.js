import {dbConnection, closeConnection} from './config/mongoConnection.js';
import * as events from './data/events.js';
import * as users from './data/users.js';

const db = await dbConnection();
await db.dropDatabase();

await users.createUser('user1', 'ABC123', '2003-05-013');
await users.createUser('user2', 'ABC123', '2007-10-10');
await users.createUser('user3', 'ABC123', '2005-02-23');

await users.updateUser('user1', 'Peter', 'Poptart');
await users.updateUser('user2', 'Troy', 'Mittens');
await users.updateUser('user3', 'Lisa', 'Teresa');

const event1 = await events.createEvent(
  'Social',
  'BBQ',
  'Come chill and eat burgers.',
  false,
  '2025-06-01',
  50,
  'user1'
);

const event2 = await events.createEvent(
  'Game Night',
  'Mario Kart',
  'Dusted off my wii, lets play some kart!',
  false,
  '2025-06-08',
  30,
  'user2'
);

const event3 = await events.createEvent(
  'Service',
  'Community Cleanup',
  'Let’s give back and clean the local park.',
  false,
  '2025-06-15',
  20,
  'user3'
);

const allEvents = await events.getAllEvents();

const e1 = allEvents.find(e => e.title === 'BBQ');
const e2 = allEvents.find(e => e.title === 'Mario Kart');
const e3 = allEvents.find(e => e.title === 'Community Cleanup');

// Now safely use their _id
await events.updateEventAppend(e1._id.toString(), 'likes', 'user2');
await events.updateEventAppend(e1._id.toString(), 'likes', 'user3');
await events.updateEventAppend(e2._id.toString(), 'likes', 'user1');

await events.updateEventAppend(e1._id.toString(), 'attendees', 'user2');
await events.updateEventAppend(e2._id.toString(), 'attendees', 'user3');
await events.updateEventAppend(e3._id.toString(), 'attendees', 'user1');
await events.updateEventAppend(e3._id.toString(), 'attendees', 'user2');

await users.mkfriends('user1', 'user2');
await users.mkfriends('user1', 'user3');
await users.mkfriends('user2', 'user1');
await users.mkfriends('user2', 'user3');
await users.mkfriends('user3', 'user1');
await users.mkfriends('user3', 'user2');

const post1 = await users.addPost('user1', "We should do another BBQ next weekend! Had so much fun!");
const post2 = await users.addPost('user2', "GGs everyone — I still can’t believe that blue shell.");
const post3 = await users.addPost('user3', "Thinking of organizing a paintball trip... thoughts?");

await users.likePost(post1._id.toString(), '--like', 'user2');
await users.likePost(post1._id.toString(), '--like', 'user3');
await users.likePost(post2._id.toString(), '--like', 'user1');

await users.likePost(post1._id.toString(), "This BBQ was fire", 'user2');
await users.likePost(post2._id.toString(), "You didn't deserve that win!", 'user1');
await users.likePost(post3._id.toString(), "Bro I’m in!!", 'user3');

console.log('Done seeding database');

await closeConnection();

import { LESSONS_DATA } from '../src/lessons_data.js';

for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.doNowStarter) {
    console.log(`=== ${key} ===`);
    console.log(JSON.stringify(lesson.doNowStarter, null, 2));
    console.log();
  } else {
    console.log(`=== ${key} === NO DO NOW STARTER`);
  }
}

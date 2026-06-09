const { LESSONS_DATA } = require('./lessons_data_cjs.js');
Object.keys(LESSONS_DATA).forEach(k => {
  const kc = LESSONS_DATA[k].knowledgeCheck || [];
  console.log(k + ': ' + kc.length + ' questions');
});

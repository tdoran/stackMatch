const db = require('../../database/db_connection');

const addMemberTechStack = (github_id, techName, orderNum) => db.query(
  `INSERT INTO member_tech_stack VALUES
  ((SELECT id FROM members WHERE github_id = $1),
  (SELECT id FROM tech_stack WHERE LOWER(tech) = LOWER($2)), $3)`,
  [github_id, techName, orderNum],
);

const getTechIDFromTechStackTable = techName => db.query(
  'SELECT id FROM tech_stack WHERE LOWER(tech) = LOWER($1)',
  [techName],
).then(res => res[0]);

const getAllTechFromTechStackTable = () => db.query('SELECT * FROM tech_stack').then(res => res.reduce((acc, curr) => {
  acc.push(curr.tech);
  return acc;
}, []));

const addNewTechIntoTechStackTable = techName => db.query(
  'INSERT INTO tech_stack (tech) VALUES ($1)',
  [techName],
);

const deleteMemberTech = (github_id, techName) => db.query(
  `DELETE FROM member_tech_stack
  WHERE member_id = (SELECT id FROM members WHERE github_id = $1) AND
  stack_id = (SELECT id FROM tech_stack WHERE LOWER(tech) = LOWER($2))`,
  [github_id, techName],
);

const deleteMemberTechStack = github_id => db.query(
  `DELETE FROM member_tech_stack
  WHERE member_id = (SELECT id FROM members WHERE github_id = $1)`,
  [github_id],
);

const getMemberTechStack = github_id => db.query(
  `SELECT 
  (SELECT array_agg(tech.tech ORDER BY stack.order_num) 
       FROM tech_stack tech
       LEFT JOIN member_tech_stack stack
       ON stack.stack_id = tech.id
       WHERE stack.member_id = mem.id
  ) AS tech_stack
  FROM members mem
  WHERE mem.github_id = $1`,
  [github_id],
).then(res => res[0]);

const updateTechOrderNum = (github_id, techName, order_num) => db.query(
  `UPDATE member_tech_stack
  SET order_num = $3
  WHERE member_id = (SELECT id FROM members WHERE github_id = $1)
  AND stack_id = (SELECT id FROM tech_stack WHERE LOWER(tech) = LOWER($2))`,
  [github_id, techName, order_num],
);


module.exports = {
  addMemberTechStack,
  getTechIDFromTechStackTable,
  getAllTechFromTechStackTable,
  addNewTechIntoTechStackTable,
  deleteMemberTech,
  getMemberTechStack,
  updateTechOrderNum,
  deleteMemberTechStack,
};

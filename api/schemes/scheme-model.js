const db = require("./../../data/db-config");

function find() {
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.*")
    .count("step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc");
}

async function findById(scheme_id) {
  const flatScheme = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.*", "st.step_id", "st.step_number", "st.instructions")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");

  const layeredScheme =
    flatScheme[0] === undefined
      ? null
      : !flatScheme[0].step_id
      ? {
          scheme_id: flatScheme[0].scheme_id,
          scheme_name: flatScheme[0].scheme_name,
          steps: [],
        }
      : {
          scheme_id: flatScheme[0].scheme_id,
          scheme_name: flatScheme[0].scheme_name,
          steps: flatScheme.map((step) => {
            return {
              step_id: step.step_id,
              step_number: step.step_number,
              instructions: step.instructions,
            };
          }),
        };

  return layeredScheme;
}

function findSteps(scheme_id) {
  return db("steps as st")
    .leftJoin("schemes as sc", "st.scheme_id", "sc.scheme_id")
    .select("st.step_id", "st.step_number", "st.instructions", "sc.scheme_name")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc");
}

async function add(scheme) {
  const newId = await db("schemes").insert(scheme);

  const newScheme = await findById(newId);

  return {
    scheme_id: newScheme.scheme_id,
    scheme_name: newScheme.scheme_name,
  };
}

async function addStep(scheme_id, step) {
  await db("steps").insert({ ...step, scheme_id: scheme_id });

  return findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};

const dbConnection = require("./connection");

const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
    employers: getCollectionFn("employers"),
    candidates: getCollectionFn("candidates"),
    jobs: getCollectionFn("jobs"),
    messages: getCollectionFn("messages")
};

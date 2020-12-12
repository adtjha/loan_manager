const scopeOptions = [
  "create/update/delete costmer profile",
  "read single customer profile",
  "read all customer profile",
  /*Loans */
  "create/update/delete loan profile",
  "read single loan profile",
  "read all loan profiles",
  /*approve */
  "approve loan profile",
  "rollback loan profile",
];

const scopesDesignated = {
  customer: [1, 4],
  agent: [0, 2, 3, 4, 5],
  admin: [0, 2, 3, 4, 5, 6, 7],
};

const getCategoryByScope = (name) => {
  const counter = scopeOptions.findIndex((scope) => scope === name);

  let categoryArray = [];

  for (const category in scopesDesignated) {
    scopesDesignated[category].forEach((e) => {
      if (e === counter) {
        categoryArray.push(category);
      }
    });
  }

  return categoryArray;
};

const getScope = (category) => {
  return scopesDesignated[category].map((scope) => scopeOptions[scope]);
};

module.exports = { getScope, getCategoryByScope };

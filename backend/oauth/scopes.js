const getScope = (category) => {
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
    Customer: [1, 4],
    Agent: [0, 2, 3, 4, 5],
    Admin: [0, 2, 3, 4, 5, 6, 7],
  };

  return scopesDesignated[category].map((scope) => scopeOptions[scope]);
};

module.exports = getScope;

// remove __v field from response in GET queries
export const removeVersionKey = function (next) {
  this.select('-__v');

  next();
};

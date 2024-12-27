class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    // extract query parameters from the request and copy all query parameters into a new obj
    const queryObj = { ...this.queryString };

    // remove specific parameters used for pagination, sorting, and field selection
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    // convert query obj to a JSON string to manipulate operators (lte, gte)
    let queryStr = JSON.stringify(queryObj);
    // replace comparison operators with MongoDB syntax ($gte)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Build the query obj, parse the modified string back into an obj and pass it to the MongoDB 'find' method

    this.query = this.query.find(JSON.parse(queryStr));

    // 'this' refers to the current instance of the APIFeatures class on which the filter() method was called (which contains the filtered query)
    return this;
  }

  sort() {
    // if the request includes a 'sort' query parameters, apply the specified sorting
    if (this.queryString.sort) {
      // split multiple sorting criteria by commas and join them with spaces (MongoDB syntax)
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // .select() -> specifies which fields of a document should be included or excluded in the query results (field projection)
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // multiplying by 1 will convert the string into a number
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // .skip-> amount of results we want to skip before we start querying
    // .limit-> sets a maximum number of results to return from the query
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

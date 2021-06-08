class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const execludedFields = ["page", "sort", "limit", "fields"];

    execludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr)); //return query
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      //default sorting
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const feilds = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(feilds);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    if (this.queryString.page && this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeatures;

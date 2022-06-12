class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryCopy[field]);
    let price = queryCopy.price && JSON.stringify(queryCopy.price);
    if (price) {
      price = price.replace(/\b(gt|gte|lt|lte)\b/g, (v) => `$${v}`);
      price = JSON.parse(price);
      queryCopy["price"] = price;
    }

    this.query = this.query.find(queryCopy);
    return this;
  }
  pagination(resultsPerPage = 10) {
    //filter data out of 10 based on page
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);

    /**
     * @explain ...
     * limit: the limit() method limits the number of records or documents that you want.
     * skip : This method can only take one parameter, i.e., offset.
     *  Here, offset is the number of the document to skip in the final result set.
     */
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
